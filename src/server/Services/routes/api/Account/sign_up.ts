import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";
import { AccountServices } from "../../../AccountService.js";

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

    account_service.signUp(data);
    //respond with the data retrieved as a JSon
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
