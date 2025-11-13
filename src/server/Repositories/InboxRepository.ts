import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { meetingRequests, meetingStatus } from "../../../drizzle/schema.js";
import * as schema from "../../../drizzle/schema.js";
import { eq, and, lte, gte } from "drizzle-orm";

type MeetingStatus = (typeof meetingStatus.enumValues)[number];
export type InboxRow = Awaited<
  ReturnType<InboxRepository["getUserInbox"]>
>[number];

export class InboxRepository {
  private readonly database: NodePgDatabase<typeof schema>;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }

  //status, date try to enumerate the status.
  public async getUserInbox(
    userId: number,
    status?: MeetingStatus,
    startDate?: string,
    endDate?: string,
    fromStudent?: boolean
  ) {
    const userColumn =
      fromStudent === true
        ? meetingRequests.tutorId
        : meetingRequests.studentId;
    const conditions = [eq(userColumn, Number(userId))];

    if (status) {
      conditions.push(eq(meetingRequests.status, status));
    }

    //dates should be formatted as yyyy-mm-dd
    if (startDate && endDate) {
      conditions.push(
        gte(meetingRequests.requestedStart, startDate),
        lte(meetingRequests.requestedEnd, endDate)
      );
    } else if (startDate && !endDate) {
      conditions.push(gte(meetingRequests.requestedStart, startDate));
    } else if (endDate) {
      conditions.push(lte(meetingRequests.requestedEnd, endDate));
    }
    console.log("Database Called");
    return await this.database
      .select()
      .from(meetingRequests)
      .where(and(...conditions));
  }
}
