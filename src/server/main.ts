import express from "express";
import ViteExpress from "vite-express";

const app = express();

import { drizzle } from "drizzle-orm/node-postgres";
const db = drizzle(process.env.DATABASE_URL!);

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
