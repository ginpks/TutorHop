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
      res.status(403);
      throw new Error("JWT Token is null.");
    } else {
      res.json({ message: "successful login", token });
    }
    console.log("successfully connected to protected route");
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
