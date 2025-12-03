import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { AuthService } from "../../../AuthService.js";

const router = express.Router();
/**
 * POST /
 *
 *
 */
router.post("/login", async (req, res) => {
  try {
    //retrieve the parameters sent through the query
    //get the database and the service
    const db = getDatabaseService();
    const data = await req.body;
    const auth_service: AuthService = (await db).authServices;

    const token = await auth_service.login(data);

    if (token === false) {
      res.status(403);
      throw new Error("Could not get the JWT token.");
    } else {
      res.status(200).send(token as object);
    }
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
