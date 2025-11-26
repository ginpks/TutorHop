import { UserRole } from "../Enums/UserEnums.js";

export interface SignUpForm {
  accountType: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subjects: string;
  availability?: string;
  meetingPreference: string;
}
