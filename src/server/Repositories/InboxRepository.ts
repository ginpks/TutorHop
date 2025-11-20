import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  meetingRequests,
  meetingStatus,
  users,
  subjects,
} from "../../../drizzle/schema.js";
import * as schema from "../../../drizzle/schema.js";
import { eq, and, lte, gte, or } from "drizzle-orm";

type MeetingStatus = (typeof meetingStatus.enumValues)[number];
export type InboxRow = Awaited<
  ReturnType<InboxRepository["getUserInbox"]>
>[number];

export class InboxRepository {
  private readonly database: NodePgDatabase<typeof schema>;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }

  public async getUserInbox(
    userId: number,
    status?: MeetingStatus,
    startDate?: string,
    endDate?: string,
    fromStudent?: boolean,
  ) {
    const currentUserColumn =
      fromStudent === true
        ? meetingRequests.studentId
        : meetingRequests.tutorId;

    const otherUserColumn =
      fromStudent === true
        ? meetingRequests.tutorId
        : meetingRequests.studentId;
    const conditions = [eq(otherUserColumn, Number(userId))];

    if (status) {
      conditions.push(eq(meetingRequests.status, status));
    }

    //dates should be formatted as yyyy-mm-dd
    if (startDate && endDate) {
      conditions.push(
        gte(meetingRequests.requestedStart, startDate),
        lte(meetingRequests.requestedEnd, endDate),
      );
    } else if (startDate && !endDate) {
      conditions.push(gte(meetingRequests.requestedStart, startDate));
    } else if (endDate) {
      conditions.push(lte(meetingRequests.requestedEnd, endDate));
    }
    console.log("Inbox preview database call made");
    return await this.database
      .select({
        id: meetingRequests.id,
        createdAt: meetingRequests.createdAt,
        receiver: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        subjects: {
          name: subjects.name,
          topic: meetingRequests.topic,
        },
      })
      .from(meetingRequests)
      .limit(4)
      .leftJoin(users, eq(users.id, currentUserColumn))
      .leftJoin(subjects, eq(subjects.id, meetingRequests.subjectId))
      .where(and(...conditions));
  }
}
