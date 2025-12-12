import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { tutorProfiles } from "../../../../../../drizzle/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

/**
 * GET /:userId/profile
 * Get tutor profile for a specific user
 */
router.get("/:userId/profile", async (req, res) => {
  try {
    const db = getDatabaseService();
    const database = (await db).db;
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    // Fetch tutor profile
    const profile = await database
      .select({
        userId: tutorProfiles.userId,
        bio: tutorProfiles.bio,
      })
      .from(tutorProfiles)
      .where(eq(tutorProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) {
      res.status(404).json({ error: "Tutor profile not found" });
      return;
    }

    // Convert BigInt IDs to numbers for JSON serialization
    const serializedProfile = {
      userId: Number(profile[0].userId),
      bio: profile[0].bio,
    };

    res.json(serializedProfile);
  } catch (err: any) {
    console.error("Error fetching tutor profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
