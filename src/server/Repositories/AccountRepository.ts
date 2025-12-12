import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users, userSubjects } from "../../../drizzle/schema.js";
import * as schema from "../../../drizzle/schema.js";
import { eq, and, inArray } from "drizzle-orm";

export class AccountRepository {
  private readonly database: NodePgDatabase<typeof schema>;

  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }

  public async updateMeetingPreference(
    userId: number,
    meetingPreference: "in_person" | "zoom" | "either"
  ) {
    const result = await this.database
      .update(users)
      .set({ meetingPreference })
      .where(eq(users.id, userId))
      .returning();

    return result[0] || null;
  }

  public async deleteUserSubjects(
    userId: number,
    subjectIds: number[],
    role: "student" | "tutor"
  ) {
    if (subjectIds.length === 0) return;

    await this.database
      .delete(userSubjects)
      .where(
        and(
          eq(userSubjects.userId, userId),
          inArray(userSubjects.subjectId, subjectIds),
          eq(userSubjects.role, role)
        )
      );
  }

  public async addUserSubjects(
    userId: number,
    subjectIds: number[],
    role: "student" | "tutor"
  ) {
    if (subjectIds.length === 0) return;

    const values = subjectIds.map((subjectId) => ({
      userId,
      subjectId,
      role,
    }));

    await this.database.insert(userSubjects).values(values);
  }
}
