import { AccountRepository } from "../Repositories/AccountRepository.js";

export class AccountServices {
  private readonly AccountRepo: AccountRepository;

  constructor(acc: AccountRepository) {
    this.AccountRepo = acc;
  }

  async updateUserProfile(deleted: any, added: any, meeting_pref: any) {
    //TODO map the fields to database acceptable values and then pass to repo
  }
}
