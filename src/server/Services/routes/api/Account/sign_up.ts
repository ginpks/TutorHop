import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { AccountServices } from "../../../AccountService.js";
import { AuthService } from "../../../AuthService.js";

const router = express.Router();
/**
 * POST /
 *
 *
 */
router.post("/signup", async (req, res) => {
  try {
    //retrieve the parameters sent through the query
    //get the database and the service
    const db = getDatabaseService();
    const data = await req.body;
    const account_service: AccountServices = (await db).accountServices;
    const auth_service: AuthService = (await db).authServices;

    const newUser = auth_service.register(data);
    //respond with the data retrieved as a JSon
    res.status(200).json(newUser);
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
