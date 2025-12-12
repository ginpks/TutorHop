import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";

const router = express.Router();
/**
 * POST /
 *
 *
 */
router.post("/update", async (req, res) => {
  try {
    const db = getDatabaseService();
    const account_services = (await db).accountServices;

    const deleted = req.body.deleted;
    const added = req.body.deleted;
    const meeting_pref = req.body.pref;

    account_services.updateUserProfile(deleted, added, meeting_pref);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
