import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";

const router = express.Router();
/**
 * GET /
 *
 *
 */
router.get("/data", async (req, res) => {
  try {
    const db = getDatabaseService();
    const auth_service = (await db).authServices;
    const raw_token = req.query.token as string;
    const token = auth_service.verifyToken(raw_token);

    if (token === null) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }

    // Fetch the user data from the database using the userId from token
    const userId = token.userId;
    const user = await auth_service.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Return user data without sensitive fields
    res.json({
      message: "successful login",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        meetingPreference: user.meetingPreference,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
