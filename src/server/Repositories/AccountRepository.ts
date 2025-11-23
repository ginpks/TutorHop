import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  meetingRequests,
  meetingStatus,
  users,
  subjects,
} from "../../../drizzle/schema.js";
import * as schema from "../../../drizzle/schema.js";
import { eq, and, lte, gte, or } from "drizzle-orm";

export class AccountRepository {
  private readonly database: NodePgDatabase<typeof schema>;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }
}
