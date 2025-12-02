import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../../../drizzle/schema.js";
import { InboxRepository } from "../../Repositories/InboxRepository.js";
import { InboxServices } from "../InboxService.js";
import { ProfileInboxRepository } from "../../Repositories/ProfileInboxRepository.js";
import { ProfileInboxServices } from "../ProfileInboxService.js";
import { AuthRepository } from "../../Repositories/AuthRepository.js";
import { AuthService } from "../AuthService.js";
import "dotenv/config";
let database: DatabaseService | null = null;

export class DatabaseService {
  public readonly db: NodePgDatabase<typeof schema>;
  public authRepository: AuthRepository;
  public authServices: AuthService;
  public inboxRepository: InboxRepository;
  public inboxServices: InboxServices;
  public profileInboxRepository: ProfileInboxRepository;
  public profileInboxServices: ProfileInboxServices;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.db = db;

    // Auth
    this.authRepository = new AuthRepository(db);
    this.authServices = new AuthService(this.authRepository);

    // Inbox
    this.inboxRepository = new InboxRepository(db);
    //services
    this.inboxServices = new InboxServices(this.inboxRepository);
    this.inboxServices = new InboxServices(this.inboxRepository);

    // Profile Inbox
    this.profileInboxRepository = new ProfileInboxRepository(db);
    this.profileInboxServices = new ProfileInboxServices(
      this.profileInboxRepository
    );
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
