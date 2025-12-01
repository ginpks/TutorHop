import express from "express";
import { InboxServices, MeetingStatus } from "../../../InboxService.js";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";

const router = express.Router();
/**
 * GET /
 * Retrieves inbox previews.
 * req.query contains params for search
 */
router.get("/:id/preview", async (req, res) => {
  try {
    //retrieve the parameters sent through the query
    const userID = Number(req.params.id);
    const status = req.query.status as MeetingStatus | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const fromStudent = req.query.tutor === "true";
    //get the database and the service
    const db = getDatabaseService();
    const inbox_service: InboxServices = (await db).inboxServices;
    const data = await inbox_service.inboxPreviews(
      userID,
      status as MeetingStatus,
      startDate,
      endDate,
      fromStudent,
    );
    //respond with the data retrieved as a JSon
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
