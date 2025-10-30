import { primaryKey } from "drizzle-orm/gel-core";
import {
  timestamp,
  bigserial,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

/*id PK BIGSERIAL, not null
email VARCHAR(255), not null, unique
password_hash VARCHAR(255), not null
first_name VARCHAR(80), not null
last_name VARCHAR(80), not null
role ENUM('student','tutor','both'), not null, default 'student'
meeting_preference ENUM('in_person','zoom','either'), not null, default 'either'
email_verified_at TIMESTAMP, null
created_at TIMESTAMP, not null, default now()
updated_at TIMESTAMP, not null, default now()

tutor_profiles
user_id PK/FK users.id, not null, unique
bio TEXT, null
Possibly add other info that isn’t in Users (unique to tutors)

student_profiles
user_id PK/FK users.id, not null, unique
Possibly add other info that isn’t in Users (unique to students)

 */

export const usersTable = pgTable("users", {
  id: bigserial({ mode: "number" }).primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  first_name: varchar({ length: 80 }).notNull(),
  last_name: varchar({ length: 80 }).notNull(),
  role: varchar({ enum: ["student", "tutor", "both"] }),
  meeting_preference: varchar({ enum: ["in_person", "zoom", "either"] })
    .notNull()
    .default("either"),
  email_verified: timestamp().notNull(),
  updated_at: timestamp().notNull().defaultNow(),
  created_at: timestamp().notNull().defaultNow(),
});

export const tutor_profiles = pgTable("tutor_profiles", {
  user_id: bigserial({ mode: "number" })
    .primaryKey()
    .notNull()
    .references(() => usersTable.id),
  bio: text(),
});
export const student_profiles = pgTable("tutor_profiles", {
  user_id: bigserial({ mode: "number" })
    .primaryKey()
    .notNull()
    .references(() => usersTable.id),
});
