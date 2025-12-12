import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../../../drizzle/schema.js";
import * as schema from "../../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export class AccountRepository {
  private readonly database: NodePgDatabase<typeof schema>;

  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }
}
