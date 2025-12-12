import express from "express";
import { InboxServices } from "../../../InboxService.js";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";

const router = express.Router();

/**
 * GET /appointments/:id/upcoming
 * Retrieves upcoming accepted appointments for a user.
 * Returns data as MailPreviewMessages.
 */
router.get("/:id/upcoming", async (req, res) => {
  try {
    const userID = Number(req.params.id);
    const isCurrentUserAStudent = req.query.tutor === "false";
    const now = new Date().toISOString();

    const db = await getDatabaseService();
    const inbox_service: InboxServices = db.inboxServices;

    const appointments = await inbox_service.inboxPreviews(
      userID,
      "accepted",
      now,
      undefined,
      isCurrentUserAStudent
    );
    res.status(200).json(appointments);
  } catch (err: any) {
    console.error("Upcoming appointments error:", err);
    res.status(500).json({ error: "Failed to load upcoming appointments" });
  }
});

export default router;
