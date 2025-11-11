import express from "express";
import ViteExpress from "vite-express";
import { getDatabaseService } from "./Services/UtilitiesServices/DatabaseService.js";
import { apiStart } from "./Services/UtilitiesServices/APIConfig.js";

export const app = express();

export async function createServer() {
  await getDatabaseService();

  app.get("/hello", (_, res) => {
    res.send("Hello Vite + React + TypeScript!");
  });

  ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000...")
  );
  apiStart(app);
}

createServer().catch((err) => {
  console.error("Failed to start server:", err);
});
