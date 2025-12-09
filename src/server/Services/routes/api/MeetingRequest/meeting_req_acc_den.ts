import express from "express";
import { InboxServices, MeetingStatus } from "../../../InboxService.js";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
const router = express.Router();

/*/Patch
 * Accept or deny a meeting request
 */

router.patch("/:id/status", async (req, res) => {
  try {
    const meetingRequestID = Number(req.params.id);
    const answer: MeetingStatus = req.body.status;
    const db = getDatabaseService();
    const inbox_service: InboxServices = (await db).inboxServices;
    const data = await inbox_service.meetingService(
      meetingRequestID,
      answer
    );

  res.status(200).json({success: true});
  } catch (err: any) {
    console.log(err);
  }
});

export default router;