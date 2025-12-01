import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../../../drizzle/schema.js";
import * as schema from "../../../drizzle/schema.js";
import { eq } from "drizzle-orm";

export class AuthRepository {
  private readonly database: NodePgDatabase<typeof schema>;

  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }

  public async findUserByEmail(email: string) {
    const result = await this.database
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] || null;
  }

  public async findUserById(id: number) {
    const result = await this.database
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] || null;
  }

  public async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "student" | "tutor";
    meetingPreference: "in_person" | "zoom" | "either";
  }) {
    const result = await this.database
      .insert(users)
      .values(userData)
      .returning();

    return result[0];
  }
}
