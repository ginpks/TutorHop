import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { userSubjects, subjects } from "../../../../../../drizzle/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

/**
 * GET /:userId/subjects
 * Get all subjects for a specific user
 */
router.get("/:userId/subjects", async (req, res) => {
  try {
    const db = getDatabaseService();
    const database = (await db).db;
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    // Join user_subjects with subjects to get full subject info
    const userSubjectsList = await database
      .select({
        id: subjects.id,
        code: subjects.code,
        name: subjects.name,
        role: userSubjects.role,
      })
      .from(userSubjects)
      .innerJoin(subjects, eq(userSubjects.subjectId, subjects.id))
      .where(eq(userSubjects.userId, userId));

    // Convert BigInt IDs to numbers for JSON serialization
    const serializedSubjects = userSubjectsList.map((s) => ({
      id: Number(s.id),
      code: s.code,
      name: s.name,
      role: s.role,
    }));

    res.json(serializedSubjects);
  } catch (err: any) {
    console.error("Error fetching user subjects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
