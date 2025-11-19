import express from "express";
import { InboxServices, MeetingStatus } from "../../../InboxService.js";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";

const router = express.Router();

/**
 * GET /
 * Retrieves inbox previews.
 */
router.get("/:id/preview", async (req, res) => {
  try {
    const userID = Number(req.params.id);
    const status = req.query.status as MeetingStatus | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const fromStudent = req.query.tutor === "true";
    const db = getDatabaseService();
    const inbox_service: InboxServices = (await db).inboxServices;
    const data = await inbox_service.inboxPreviews(
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
