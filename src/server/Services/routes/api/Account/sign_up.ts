import express from "express";
import { getDatabaseService } from "../../../UtilitiesServices/DatabaseService.js";

const router = express.Router();
/**
 * POST /
 * 
 *
 */
router.post("/:id/preview", async (req, res) => {
  try {
    //retrieve the parameters sent through the query
    //get the database and the service
    const db = getDatabaseService();
    let data;
    //respond with the data retrieved as a JSon
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
  }
});

export default router;
