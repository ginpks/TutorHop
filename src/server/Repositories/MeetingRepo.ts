import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema.js";

export interface CreateMeetingDTO {
  studentId: number;
  tutorId: number;
  subjectId: number;
  requestedStart: string;
  requestedEnd: string;
  mode: "in_person" | "zoom";
  topic?: string | null;
}

export class MeetingRepository {
  private readonly database: NodePgDatabase<typeof schema>;

  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }

  public async createMeetingInDB(data: CreateMeetingDTO) {
    const newRequest = await this.database
      .insert(schema.meetingRequests)
      .values({
        studentId: data.studentId,
        tutorId: data.tutorId,
        subjectId: data.subjectId,
        requestedStart: data.requestedStart,
        requestedEnd: data.requestedEnd,
        mode: data.mode,
        topic: data.topic ?? null,
        status: "pending",
      })
      .returning();

    return newRequest;
  }
}
