import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema.js";

import { UserInsert } from "../../shared/Mappers/AccountsMapper.js";

export class AccountRepository {
  private readonly database: NodePgDatabase<typeof schema>;
  constructor(db: NodePgDatabase<typeof schema>) {
    this.database = db;
  }

  public async signUpPost(signUpForm: UserInsert) {
    try {
      console.log("Accounts Repository: ", signUpForm);
      await this.database.insert(schema.users).values(signUpForm).execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
