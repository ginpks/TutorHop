import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../../../drizzle/schema.js";
import { InboxRepository } from "../../Repositories/InboxRepository.js";
import { InboxServices } from "../InboxService.js";
import { ProfileInboxRepository } from "../../Repositories/ProfileInboxRepository.js";
import { ProfileInboxServices } from "../ProfileInboxService.js";
import "dotenv/config";
let database: DatabaseService | null = null;

export class DatabaseService {
  public readonly db: NodePgDatabase<typeof schema>;
  public inboxRepository: InboxRepository;
  public inboxServices: InboxServices;
  public profileInboxRepository: ProfileInboxRepository;
  public profileInboxServices: ProfileInboxServices;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.db = db;
    //repositories
    this.inboxRepository = new InboxRepository(db);
    this.profileInboxRepository = new ProfileInboxRepository(db);
    //services
    this.inboxServices = new InboxServices(this.inboxRepository);
    this.profileInboxServices = new ProfileInboxServices(this.profileInboxRepository);
  }
}

export async function getDatabaseService(): Promise<DatabaseService> {
  if (database) {
    return database;
  }
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is missing");
    }
    const pool = new Pool({
      connectionString: connectionString,
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
