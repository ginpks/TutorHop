import { AccountRepository } from "../Repositories/AccountRepository.js";

export class AccountServices {
  private readonly AccountRepo: AccountRepository;

  constructor(acc: AccountRepository) {
    this.AccountRepo = acc;
  }

  async updateUserProfile(
    userId: number,
    role: "student" | "tutor",
    deleted: (string | number)[] | null | undefined,
    added: (string | number)[] | null | undefined,
    meeting_pref: string | null | undefined
  ) {
    // Map the fields to database acceptable values and then pass to repo
    const deletedSubjectIds: number[] =
      Array.isArray(deleted) && deleted.length > 0
        ? deleted.map((id) => (typeof id === "number" ? id : Number(id)))
        : [];

    const addedSubjectIds: number[] =
      Array.isArray(added) && added.length > 0
        ? added.map((id) => (typeof id === "number" ? id : Number(id)))
        : [];

    // Map meeting preference to acceptable enum values
    let meetingPreference: "in_person" | "zoom" | "either" = "either";
    if (
      meeting_pref === "in_person" ||
      meeting_pref === "zoom" ||
      meeting_pref === "either"
    ) {
      meetingPreference = meeting_pref;
    }

    // Delete removed subjects
    if (deletedSubjectIds.length > 0) {
      await this.AccountRepo.deleteUserSubjects(
        userId,
        deletedSubjectIds,
        role
      );
    }

    // Add new subjects
    if (addedSubjectIds.length > 0) {
      await this.AccountRepo.addUserSubjects(userId, addedSubjectIds, role);
    }

    // Update meeting preference
    await this.AccountRepo.updateMeetingPreference(userId, meetingPreference);
  }
}
