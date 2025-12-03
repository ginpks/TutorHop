import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import {
  users,
  userSubjects,
  subjects,
} from "../../../../../../drizzle/schema.js";
import { eq, and, inArray, or } from "drizzle-orm";

const router = express.Router();

/**
 * GET /search
 * Search for tutors based on subjects, meeting mode, and availability
 */
router.get("/search", async (req, res) => {
  try {
    const db = getDatabaseService();
    const database = (await db).db;

    // Parse query parameters
    const subjectCodes = req.query.subjects
      ? (req.query.subjects as string).split(",")
      : [];
    const meetingMode = req.query.meetingMode as string; // "in_person", "zoom", or "either"

    // If no subjects specified, return empty results
    if (subjectCodes.length === 0) {
      res.json([]);
      return;
    }

    // First, find subject IDs from codes
    const subjectRecords = await database
      .select()
      .from(subjects)
      .where(inArray(subjects.code, subjectCodes));

    const subjectIds = subjectRecords.map((s) => Number(s.id));

    if (subjectIds.length === 0) {
      res.json([]);
      return;
    }

    // Find tutors who teach these subjects
    const tutorSubjects = await database
      .select({
        userId: userSubjects.userId,
        subjectId: userSubjects.subjectId,
      })
      .from(userSubjects)
      .where(
        and(
          inArray(userSubjects.subjectId, subjectIds),
          eq(userSubjects.role, "tutor"),
        ),
      );

    const tutorIds = [...new Set(tutorSubjects.map((ts) => Number(ts.userId)))];

    if (tutorIds.length === 0) {
      res.json([]);
      return;
    }

    // Get tutor user details with optional meeting mode filter
    const whereConditions: any[] = [
      inArray(users.id, tutorIds),
      eq(users.role, "tutor"),
    ];

    // Filter by meeting mode if specified
    if (meetingMode && meetingMode !== "either") {
      whereConditions.push(
        or(
          eq(users.meetingPreference, meetingMode as any),
          eq(users.meetingPreference, "either"),
        ),
      );
    }

    const tutors = await database
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        meetingPreference: users.meetingPreference,
      })
      .from(users)
      .where(and(...whereConditions) as any);

    // Build result with subjects for each tutor
    const results = tutors.map((tutor) => {
      const tutorSubjectIds = tutorSubjects
        .filter((ts) => Number(ts.userId) === Number(tutor.id))
        .map((ts) => Number(ts.subjectId));

      const tutorSubjectRecords = subjectRecords.filter((s) =>
        tutorSubjectIds.includes(Number(s.id)),
      );

      return {
        id: Number(tutor.id),
        name: `${tutor.firstName} ${tutor.lastName.charAt(0)}.`,
        firstName: tutor.firstName,
        lastName: tutor.lastName,
        email: tutor.email,
        subjects: tutorSubjectRecords.map((s) => ({
          id: Number(s.id),
          code: s.code,
          name: s.name,
        })),
        meetingPreference: tutor.meetingPreference,
        online:
          tutor.meetingPreference === "zoom" ||
          tutor.meetingPreference === "either",
        location:
          tutor.meetingPreference === "in_person"
            ? "Campus"
            : tutor.meetingPreference === "zoom"
              ? "Zoom"
              : "Hybrid",
      };
    });

    res.json(results);
  } catch (err: any) {
    console.error("Tutor search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
