import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { subjects } from "../../../../../../drizzle/schema.js";

const router = express.Router();

/**
 * GET /list
 * Get all subjects
 */
router.get("/list", async (req, res) => {
  try {
    const db = getDatabaseService();
    const database = (await db).db;

    const allSubjects = await database
      .select({
        id: subjects.id,
        code: subjects.code,
        name: subjects.name,
      })
      .from(subjects)
      .orderBy(subjects.code);

    console.log(`Fetched ${allSubjects.length} subjects`);

    // Convert BigInt IDs to numbers for JSON serialization
    const serializedSubjects = allSubjects.map(s => ({
      id: Number(s.id),
      code: s.code,
      name: s.name,
    }));

    res.json(serializedSubjects);
  } catch (err: any) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
