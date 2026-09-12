import express from "express";
import https from "https";

const router = express.Router();

const NEWS_FEED_URL = "https://www.umass.edu/news/feed";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ITEMS = 6;
const MAX_FETCH_BYTES = 512 * 1024; // 512 KB cap on upstream response
const FETCH_TIMEOUT_MS = 5_000;

/** Strip any HTML tags a title/description may carry, then clamp length. */
function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"),
  );
  return match?.[1] ?? "";
}

interface CampusNewsItem {
  title: string;
  link: string;
  snippet: string;
  publishedAt: string | null;
  author: string | null;
  imageUrl: string | null;
}

const cache: { data: CampusNewsItem[] | null; fetchedAt: number } = {
  data: null,
  fetchedAt: 0,
};

function fetchFeed(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        timeout: FETCH_TIMEOUT_MS,
        headers: {
          Accept:
            "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
          "User-Agent": "TutorHop/1.0 (+https://www.umass.edu/)",
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`Upstream responded ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        let size = 0;
        res.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_FETCH_BYTES) {
            request.destroy(new Error("Upstream response too large"));
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      },
    );
    request.on("timeout", () => request.destroy(new Error("Upstream timeout")));
    request.on("error", reject);
  });
}

/** Validate an image URL: must be https on the university domain. */
function safeImageUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw);
    if (
      parsed.protocol === "https:" &&
      (parsed.hostname === "www.umass.edu" || parsed.hostname === "umass.edu")
    ) {
      return parsed.toString();
    }
  } catch {
    // fall through
  }
  return null;
}

async function getCampusNews(): Promise<CampusNewsItem[]> {
  if (cache.data && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const xml = await fetchFeed(NEWS_FEED_URL);
  const items: CampusNewsItem[] = [];

  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  for (const block of itemBlocks.slice(0, MAX_ITEMS)) {
    const rawLink = sanitizeText(extractTag(block, "link"), 500);
    // Only allow links pointing back to the university domain.
    let safeLink = "";
    try {
      const parsed = new URL(rawLink);
      if (
        (parsed.protocol === "https:" && parsed.hostname === "www.umass.edu") ||
        parsed.hostname === "umass.edu"
      ) {
        safeLink = parsed.toString();
      }
    } catch {
      // Malformed or non-http link -> drop it.
    }

    const rawDate = sanitizeText(extractTag(block, "pubDate"), 64);
    const parsedDate = new Date(rawDate);

    // Optional image: enclosure url="..." or <media:content url="...">
    const enclosureMatch = block.match(/<enclosure[^>]*url="([^"]+)"/i);
    const mediaMatch = block.match(/<media:content[^>]*url="([^"]+)"/i);
    const rawImage = enclosureMatch?.[1] ?? mediaMatch?.[1] ?? "";

    items.push({
      title: sanitizeText(extractTag(block, "title"), 200),
      link: safeLink,
      snippet: sanitizeText(extractTag(block, "description"), 280),
      publishedAt: Number.isNaN(parsedDate.getTime())
        ? null
        : parsedDate.toISOString(),
      author: sanitizeText(extractTag(block, "dc:creator"), 100) || null,
      imageUrl: rawImage ? safeImageUrl(rawImage) : null,
    });
  }

  // Only cache/serve responses that produced usable content.
  if (items.length === 0 || !items.some((item) => item.title && item.link)) {
    throw new Error("Feed parse produced no usable items");
  }

  cache.data = items;
  cache.fetchedAt = Date.now();
  return items;
}

router.get("/campus", async (_req, res) => {
  try {
    const items = await getCampusNews();
    res.json({ source: "umass.edu", items });
  } catch (err) {
    console.error("Campus news fetch failed:", err);
    // Serve stale cache rather than an error, if we have one.
    if (cache.data) {
      res.json({ source: "umass.edu", items: cache.data, stale: true });
      return;
    }
    res.status(502).json({ error: "Campus news is unavailable right now." });
  }
});

export default router;
