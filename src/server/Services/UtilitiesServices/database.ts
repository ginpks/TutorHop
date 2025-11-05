import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../../../drizzle/schema.js";
let database: NodePgDatabase<typeof schema> | null = null;

export async function getDatabaseService(): Promise<
  NodePgDatabase<typeof schema>
> {
  if (database) {
    return database;
  }
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    database = drizzle(pool, { schema });
    console.log("[DatabaseService] Initialized successfully");
  } catch (err) {
    console.error("[DatabaseService] Failed to initialize:", err);
    throw err;
  }
  return database;
}
