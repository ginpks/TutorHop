import express from "express";
import ViteExpress from "vite-express";
import { getDatabaseService } from "./Services/UtilitiesServices/database.js";

export async function createServer() {
  await getDatabaseService();
  const app = express();

  app.get("/hello", (_, res) => {
    res.send("Hello Vite + React + TypeScript!");
  });

  ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000...")
  );
}

createServer().catch((err) => {
  console.error("Failed to start server:", err);
});
