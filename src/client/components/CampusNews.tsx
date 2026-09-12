import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Chip,
} from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 * CampusNews — secure news widget for the UMass Amherst feed.
 *
 * Security properties:
 *  - Data comes only from our own backend (`/news/campus`), which sanitizes
 *    and validates upstream content before it ever reaches the browser.
 *  - Everything is rendered as plain React text: no dangerouslySetInnerHTML,
 *    so even a compromised upstream feed cannot inject markup.
 *  - Links are validated to be https and point at www.umass.edu before we
 *    render them; rel="noopener noreferrer" is always applied.
 *  - Per-article `imageUrl` values are only accepted when the backend sends
 *    a safe https umass.edu URL.
 */

interface CampusNewsItem {
  title: string;
  link: string;
  snippet: string;
  publishedAt: string | null;
  author: string | null;
  imageUrl?: string | null;
}

interface CampusNewsResponse {
  source: string;
  items: CampusNewsItem[];
  stale?: boolean;
}

function isCampusNewsResponse(value: unknown): value is CampusNewsResponse {
  if (typeof value !== "object" || value === null) return false;
  const maybe = value as Record<string, unknown>;
  if (!Array.isArray(maybe.items)) return false;
  // Only trust payloads whose items match the expected shape.
  return maybe.items.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const entry = item as Record<string, unknown>;
    return (
      typeof entry.title === "string" &&
      typeof entry.link === "string" &&
      typeof entry.snippet === "string" &&
      (entry.publishedAt === null || typeof entry.publishedAt === "string") &&
      (entry.author === null || typeof entry.author === "string") &&
      (entry.imageUrl === undefined ||
        entry.imageUrl === null ||
        typeof entry.imageUrl === "string")
    );
  });
}

/** Only render links that are https and point at the university domain. */
function isSafeNewsLink(link: string): boolean {
  try {
    const url = new URL(link);
    return (
      url.protocol === "https:" &&
      (url.hostname === "www.umass.edu" || url.hostname === "umass.edu")
    );
  } catch {
    return false;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

interface CampusNewsProps {
  title?: string;
  maxItems?: number;
}

function CampusNews({ title = "Campus News", maxItems = 4 }: CampusNewsProps) {
  const [items, setItems] = useState<CampusNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/news/campus");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: unknown = await res.json();
      if (!isCampusNewsResponse(data)) {
        throw new Error("Unexpected response shape");
      }
      setItems(
        data.items
          .filter((item) => item.title && isSafeNewsLink(item.link))
          .slice(0, maxItems),
      );
    } catch (err) {
      console.error("Campus news error:", err);
      setError("Campus news is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Card
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "rgba(255, 255, 255, 0.75)",
      }}
    >
      <Card
        sx={{
          bgcolor: "#B4C5E4",
          borderRadius: "12px 12px 0 0",
          boxShadow: "none",
          backgroundImage: "none",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 1, py: 2 }}>
          <NewspaperIcon sx={{ color: "#3C3744" }} />
          <Typography variant="h5" fontWeight="bold" color="#3C3744">
            {title}
          </Typography>
          <Chip
            label="umass.edu"
            size="small"
            sx={{
              ml: 1.5,
              bgcolor: "rgba(60, 55, 68, 0.85)",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </CardContent>
      </Card>

      {loading ? (
        <CardContent sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" } }}>
          {Array.from({ length: Math.min(maxItems, 4) }).map((_, i) => (
            <Box
              key={i}
              sx={{
                border: "1px solid rgba(60, 55, 68, 0.1)",
                borderRadius: 2,
                bgcolor: "#fff",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Skeleton variant="text" width="80%" height={22} />
                <Skeleton variant="text" width="95%" height={16} />
                <Skeleton variant="text" width="70%" height={16} />
              </Box>
            </Box>
          ))}
        </CardContent>
      ) : error ? (
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            py: 4,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40, color: "rgba(60, 55, 68, 0.3)" }} />
          <Typography color="text.secondary">{error}</Typography>
        </CardContent>
      ) : items.length === 0 ? (
        <CardContent sx={{ py: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No campus news to display.</Typography>
        </CardContent>
      ) : (
        <CardContent
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {items.map((item) => {
            const date = formatDate(item.publishedAt);
            return (
              <Card
                key={item.link}
                component="a"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                elevation={0}
                sx={{
                  textDecoration: "none",
                  bgcolor: "#fff",
                  border: "1px solid rgba(60, 55, 68, 0.1)",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 20px rgba(60, 55, 68, 0.14)",
                    borderColor: "rgba(180, 197, 228, 0.8)",
                    "& .news-title": { color: "#3D52D5" },
                    "& img.news-image": { transform: "scale(1.05)" },
                    "& .news-link-icon": { opacity: 1 },
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    flexGrow: 1,
                    p: 2,
                    "&:last-child": { pb: 2 },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Typography
                      className="news-title"
                      sx={{
                        fontWeight: 700,
                        color: "#3C3744",
                        lineHeight: 1.35,
                        fontSize: "0.95rem",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <OpenInNewIcon
                      className="news-link-icon"
                      sx={{
                        fontSize: 16,
                        ml: "auto",
                        flexShrink: 0,
                        color: "rgba(60, 55, 68, 0.5)",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.snippet}
                  </Typography>
                  <Box
                    sx={{
                      mt: "auto",
                      pt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {date && (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        {date}
                      </Typography>
                    )}
                    {item.author && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        • {item.author}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}

export default CampusNews;
