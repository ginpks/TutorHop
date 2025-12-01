import {
  users,
  meetingPreference,
  availabilitySlots,
} from "../../../drizzle/schema.js";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type UserInsert = InferInsertModel<typeof users>;
export type UserSelect = Omit<
  User,
  "password" | "emailVerifiedAt" | "createdAt" | "updatedAt"
>;
export type User = InferSelectModel<typeof users>;
export type AvailabilityInsert = InferInsertModel<typeof availabilitySlots>;

export function mapRawSignUpFormToInterface(data: any): UserInsert {
  return {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.accountType,
    meetingPreference: data.meetingPreference,
  };
}
