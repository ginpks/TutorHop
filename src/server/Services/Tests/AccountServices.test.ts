import { AccountServices } from "../AccountServices.js";
import { AccountRepository } from "../../Repositories/AccountRepository.js";

describe("AccountServices", () => {
  const mockRepo: jest.Mocked<Partial<AccountRepository>> = {
    updateMeetingPreference: jest.fn(),
    deleteUserSubjects: jest.fn(),
    addUserSubjects: jest.fn(),
  };

  const service = new AccountServices(mockRepo as unknown as AccountRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateUserProfile", () => {
    it("should map fields and update user profile with valid data", async () => {
      const userId = 1;
      const role = "tutor" as const;
      const deleted = [1, 2];
      const added = [3, 4];
      const meeting_pref = "zoom";

      await service.updateUserProfile(userId, role, deleted, added, meeting_pref);

      expect(mockRepo.deleteUserSubjects).toHaveBeenCalledWith(userId, [1, 2], role);
      expect(mockRepo.addUserSubjects).toHaveBeenCalledWith(userId, [3, 4], role);
      expect(mockRepo.updateMeetingPreference).toHaveBeenCalledWith(userId, "zoom");
    });

    it("should handle empty deleted and added arrays", async () => {
      const userId = 1;
      const role = "student" as const;
      const deleted = [];
      const added = [];
      const meeting_pref = "either";

      await service.updateUserProfile(userId, role, deleted, added, meeting_pref);

      expect(mockRepo.deleteUserSubjects).not.toHaveBeenCalled();
      expect(mockRepo.addUserSubjects).not.toHaveBeenCalled();
      expect(mockRepo.updateMeetingPreference).toHaveBeenCalledWith(userId, "either");
    });

    it("should convert string IDs to numbers", async () => {
      const userId = 1;
      const role = "tutor" as const;
      const deleted = ["1", "2"];
      const added = ["3", "4"];
      const meeting_pref = "in_person";

      await service.updateUserProfile(userId, role, deleted, added, meeting_pref);

      expect(mockRepo.deleteUserSubjects).toHaveBeenCalledWith(userId, [1, 2], role);
      expect(mockRepo.addUserSubjects).toHaveBeenCalledWith(userId, [3, 4], role);
      expect(mockRepo.updateMeetingPreference).toHaveBeenCalledWith(userId, "in_person");
    });

    it("should default to 'either' for invalid meeting preference", async () => {
      const userId = 1;
      const role = "student" as const;
      const deleted = [];
      const added = [];
      const meeting_pref = "invalid_value";

      await service.updateUserProfile(userId, role, deleted, added, meeting_pref);

      expect(mockRepo.updateMeetingPreference).toHaveBeenCalledWith(userId, "either");
    });

    it("should handle only deleting subjects", async () => {
      const userId = 1;
      const role = "tutor" as const;
      const deleted = [1, 2, 3];
      const added = [];
      const meeting_pref = "zoom";

      await service.updateUserProfile(userId, role, deleted, added, meeting_pref);

      expect(mockRepo.deleteUserSubjects).toHaveBeenCalledWith(userId, [1, 2, 3], role);
      expect(mockRepo.addUserSubjects).not.toHaveBeenCalled();
      expect(mockRepo.updateMeetingPreference).toHaveBeenCalledWith(userId, "zoom");
    });

    it("should handle only adding subjects", async () => {
      const userId = 1;
      const role = "student" as const;
      const deleted = [];
      const added = [5, 6, 7];
      const meeting_pref = "in_person";

      await service.updateUserProfile(userId, role, deleted, added, meeting_pref);

      expect(mockRepo.deleteUserSubjects).not.toHaveBeenCalled();
      expect(mockRepo.addUserSubjects).toHaveBeenCalledWith(userId, [5, 6, 7], role);
      expect(mockRepo.updateMeetingPreference).toHaveBeenCalledWith(userId, "in_person");
    });
  });
});
