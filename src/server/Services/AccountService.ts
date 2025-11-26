import { mapRawSignUpFormToInterface } from "../../shared/Mappers/AccountsMapper.js";
import { AccountRepository } from "../Repositories/AccountRepository.js";
import argon2 from "argon2";

export class AccountServices {
  private accountRepo: AccountRepository;
  constructor(private readonly repo: AccountRepository) {
    this.accountRepo = repo;
  }
  /**
   * Hashes a string using argon2.
   *
   * @param password a raw string passed in by the API.
   * @returns A hashed string to be used when sending back to the database.
   */
  private async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await argon2.hash(password);
      return hashedPassword;
    } catch (err) {
      console.error("Hashing password failed: ", err);
      throw err;
    }
  }
  /**
   * Prepare signup info to be stored in DB.
   * send data back to the repo to be stored.
   *
   * @param data raw json with signup information.
   */
  public async signUp(data: any) {
    let signUpForm = mapRawSignUpFormToInterface(data);
    signUpForm.password = await this.hashPassword(signUpForm.password);
    this.accountRepo.signUpPost(signUpForm);
  }
}
