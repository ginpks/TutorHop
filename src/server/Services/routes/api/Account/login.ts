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

    auth_service.login(data);
    //respond with the data retrieved as a JSon
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
