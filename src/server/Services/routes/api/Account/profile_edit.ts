import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { authMiddleware } from "../../../../middleware/authMiddleware.js";

const router = express.Router();
/**
 * POST /update
 * Update user profile including subjects and meeting preferences
 * Requires authentication
 */
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const db = getDatabaseService();
    const account_services = (await db).accountServices;

    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.user.userId;
    const role = req.user.role as "student" | "tutor";
    const deleted = req.body.deleted;
    const added = req.body.added;
    const meeting_pref = req.body.pref;

    await account_services.updateUserProfile(
      userId,
      role,
      deleted,
      added,
      meeting_pref
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
