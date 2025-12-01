import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema.js";

import { UserInsert, UserSelect } from "../../shared/Mappers/AccountsMapper.js";
import { error } from "console";

export class AccountRepository {
  private readonly database: NodePgDatabase<typeof schema>;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }

  public async signUpPost(signUpForm: UserInsert): Promise<UserSelect[]> {
    try {
      console.log("Accounts Repository: ", signUpForm);
      const createdUser = await this.database
        .insert(schema.users)
        .values(signUpForm)
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          firstName: schema.users.firstName,
          lastName: schema.users.lastName,
          role: schema.users.role,
          meetingPreference: schema.users.meetingPreference,
        });

      if (!createdUser) {
        throw new Error("User was not created.");
      }
      return createdUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  public async logInPost(loginForm: UserInsert) {}
}
