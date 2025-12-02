import {
  users,
  meetingPreference,
  availabilitySlots,
} from "../../../drizzle/schema.js";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type UserInsert = InferInsertModel<typeof users>;
export type UserSelect = Omit<
  User,
  "emailVerifiedAt" | "createdAt" | "updatedAt"
>;
export type User = InferSelectModel<typeof users>;
export type AvailabilityInsert = InferInsertModel<typeof availabilitySlots>;
export type LoginSelect = Omit<
  User,
  | "firstName"
  | "lastName"
  | "role"
  | "meetingPreference"
  | "id"
  | "emailVerifiedAt"
  | "createdAt"
  | "updatedAt"
>;

export function mapRawSignUpFormToInterface(data: any): UserSelect {
  return {
    id: data.id,
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.accountType,
    meetingPreference: data.meetingPreference,
  };
}

export function mapRawLoginInfoToInterface(data: any): LoginSelect {
  return {
    email: data.email,
    password: data.password,
  };
}
