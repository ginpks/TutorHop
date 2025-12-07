import express from "express";
import { MeetingStatus } from "../../../InboxService.js";
const router = express.Router();

/*/Patch
 * Accept or deny a meeting request
 */

router.patch("/:id/accept-deny", async (req, res) => {
  const meetingRequestID = Number(req.params.id);
  const answer: MeetingStatus = req.body.answer;
});
