import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { meetingRequests } from "../../../../../../drizzle/schema.js";

const router = express.Router();

/**
 * POST /create
 * Create a new meeting request
 */
router.post("/create", async (req, res) => {
  try {
    const db = getDatabaseService();
    const database = (await db).db;

    const {
      studentId,
      tutorId,
      subjectId,
      requestedStart,
      requestedEnd,
      mode,
      topic,
    } = req.body;

    console.log("Meeting request creation attempt:", {
      studentId,
      tutorId,
      subjectId,
      requestedStart,
      requestedEnd,
      mode,
      topic,
    });

    // Validate required fields
    if (
      !studentId ||
      !tutorId ||
      !subjectId ||
      !requestedStart ||
      !requestedEnd ||
      !mode
    ) {
      console.log("Missing required fields");
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Validate mode
    if (mode !== "in_person" && mode !== "zoom") {
      console.log("Invalid mode:", mode);
      res
        .status(400)
        .json({ error: "Invalid meeting mode. Must be 'in_person' or 'zoom'" });
      return;
    }

    // Create the meeting request
    const newRequest = await database
      .insert(meetingRequests)
      .values({
        studentId: Number(studentId),
        tutorId: Number(tutorId),
        subjectId: Number(subjectId),
        requestedStart,
        requestedEnd,
        mode: mode as "in_person" | "zoom",
        topic: topic || null,
        status: "pending",
      })
      .returning();

    console.log("Meeting request created successfully:", newRequest[0]);

    res.status(201).json({
      message: "Meeting request created successfully",
      request: newRequest[0],
    });
  } catch (err: any) {
    console.error("Meeting request creation error:", err);

    // Check if it's a duplicate key error
    if (err.code === '23505' || err.message?.includes('duplicate key')) {
      res.status(500).json({
        error: "Database sequence error. Please contact an administrator to run 'node fix-sequences.js'",
        details: "The auto-increment counter is out of sync"
      });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
