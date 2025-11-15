import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../../../drizzle/schema.js";
import { InboxRepository } from "../../Repositories/InboxRepository.js";
import { InboxServices } from "../InboxService.js";
let database: DatabaseService | null = null;

export class DatabaseService {
  public readonly db: NodePgDatabase<typeof schema>;
  public inboxRepository: InboxRepository;
  public inboxServices: InboxServices;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.db = db;
    //repositories
    this.inboxRepository = new InboxRepository(db);
    //services
    this.inboxServices = new InboxServices(this.inboxRepository);
  }
}

export async function getDatabaseService(): Promise<DatabaseService> {
  if (database) {
    return database;
  }
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const rawDatabase = drizzle(pool, { schema });

    database = new DatabaseService(rawDatabase);

    console.log("[DatabaseService] Initialized successfully");
  } catch (err) {
    console.error("[DatabaseService] Failed to initialize:", err);
    throw err;
  }
  return database;
}
