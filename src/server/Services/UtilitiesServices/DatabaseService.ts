import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../../../drizzle/schema.js";
import { InboxRepository } from "../../Repositories/InboxRepository.js";
import { InboxServices } from "../InboxService.js";
import { AuthRepository } from "../../Repositories/AuthRepository.js";
import { AuthService } from "../AuthService.js";
import "dotenv/config";
import { MeetingRepository } from "../../Repositories/MeetingRepo.js";
import { MeetingServices } from "../MeetingService.js";
let database: DatabaseService | null = null;

export class DatabaseService {
  public readonly db: NodePgDatabase<typeof schema>;
  public authRepository: AuthRepository;
  public authServices: AuthService;
  public inboxRepository: InboxRepository;
  public inboxServices: InboxServices;
  public meetingRepo: MeetingRepository;
  public meetingService: MeetingServices;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.db = db;

    //meetings
    this.meetingRepo = new MeetingRepository(db);
    this.meetingService = new MeetingServices(this.meetingRepo);

    // Auth
    this.authRepository = new AuthRepository(db);
    this.authServices = new AuthService(this.authRepository);

    // Inbox
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
