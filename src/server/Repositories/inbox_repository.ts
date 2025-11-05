import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { getDatabaseService } from "../Services/UtilitiesServices/database.js";
import { meetingRequests } from "../../../drizzle/schema.js";

export class InboxRepository {
  private database: NodePgDatabase<any>;
  constructor(db: NodePgDatabase<any>) {
    this.database = db;
  }

  public async getUserInbox(id: number) {
    this.database.select().from(meetingRequests);
  }
}
