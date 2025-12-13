import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { meetingRequests } from "../../../../../../drizzle/schema.js";
import { MeetingServices } from "../../../MeetingService.js";

const router = express.Router();

/**
 * POST /create
 * Create a new meeting request
 */
router.post("/create", async (req, res) => {
  try {
    const db = getDatabaseService();
    const meetingservice: MeetingServices = (await db).meetingService;

    const newRequest = meetingservice.createMeetingRequest(req);

    res.status(201).json({
      message: "Meeting request created successfully",
      request: newRequest,
    });
  } catch (err: any) {
    console.error("Meeting request creation error:", err);

    // Check if it's a duplicate key error
    if (err.code === "23505" || err.message?.includes("duplicate key")) {
      res.status(500).json({
        error:
          "Database sequence error. Please contact an administrator to run 'node fix-sequences.js'",
        details: "The auto-increment counter is out of sync",
      });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
