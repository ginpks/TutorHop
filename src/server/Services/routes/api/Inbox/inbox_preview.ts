import express from "express";
import { InboxServices, MeetingStatus } from "../../../InboxService.js";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";

const router = express.Router();

/**
 * GET /
 * Retrieves inbox previews.
 */
router.get("/inbox/:id/preview", async (req, res) => {
  try {
    const { ur } = req.query;

    const userID = Number(req.params.id);
    const status = String(req.headers.status);
    const startDate = String(req.headers.startDate);
    const endDate = String(req.headers.endDate);
    const fromStudent = Boolean(req.headers.fromStudent);

    const db = getDatabaseService();
    const inbox_service: InboxServices = (await db).inboxServices;
    const data = inbox_service.inboxPreviews(
      userID,
      status as MeetingStatus,
      startDate,
      endDate,
      fromStudent
    );

    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
