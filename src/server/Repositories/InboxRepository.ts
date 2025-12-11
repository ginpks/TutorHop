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
    isCurrentUserAStudent?: boolean
  ) {
    //determine whether the perspective the inbox is a tutor or a student
    const otherUserColumn =
      isCurrentUserAStudent === true
        ? meetingRequests.tutorId
        : meetingRequests.studentId;

    const currentUserColumn =
      isCurrentUserAStudent === true
        ? meetingRequests.studentId
        : meetingRequests.tutorId;

    const conditions = [eq(currentUserColumn, Number(userId))];

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
    console.log("Inbox preview database call made");
    //using the database that is passed into the class we call the database

    const databaseCall = await this.database
      .select({
        //specify the information that we want from the schema which includes the foreign keys from the database
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
        requestedStart: meetingRequests.requestedStart,
        requestedEnd: meetingRequests.requestedEnd,
        status: meetingRequests.status,
        meetingMode: meetingRequests.mode,
      })
      //specify the original table we are pulling from
      .from(meetingRequests)
      .limit(4)
      //then join the users and subjects that are valid for the user and subject that is being called in the meeting request
      .leftJoin(users, eq(users.id, otherUserColumn))
      .leftJoin(subjects, eq(subjects.id, meetingRequests.subjectId))
      .where(and(...conditions));
    return databaseCall;
  }

  public async updateMeetingStatus(
    meetingRequestId: number,
    answer: MeetingStatus
  ) {
    return await this.database
      .update(meetingRequests)
      .set({ status: answer })
      .where(eq(meetingRequests.id, BigInt(meetingRequestId)))
      .returning();
  }
}
