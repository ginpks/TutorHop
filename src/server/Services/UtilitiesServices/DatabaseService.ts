import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../../../drizzle/schema.js";
import { InboxRepository } from "../../Repositories/InboxRepository.js";
import { InboxServices } from "../InboxService.js";
import "dotenv/config";
import { AccountRepository } from "../../Repositories/AccountRepository.js";
import { AccountServices } from "../AccountService.js";
let database: DatabaseService | null = null;

export class DatabaseService {
  public readonly db: NodePgDatabase<typeof schema>;
  public inboxRepository: InboxRepository;
  public inboxServices: InboxServices;
  public accountRepository: AccountRepository;
  public accountServices: AccountServices;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.db = db;
    //repositories
    this.inboxRepository = new InboxRepository(db);
    this.accountRepository = new AccountRepository(db);
    //services
    this.inboxServices = new InboxServices(this.inboxRepository);
    this.accountServices = new AccountServices(this.accountRepository);
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
