export enum UserRole {
  STUDENT = "student",
  TUTOR = "tutor",
  ADMIN = "admin",
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.STUDENT]: "Student",
  [UserRole.TUTOR]: "Tutor",
  [UserRole.ADMIN]: "Administrator",
};
