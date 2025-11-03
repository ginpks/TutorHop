import { pgTable, unique, bigint, varchar, timestamp, foreignKey, text, bigserial, check, smallint, date, time, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const meetingMode = pgEnum("meeting_mode", ['in_person', 'zoom'])
export const meetingPreference = pgEnum("meeting_preference", ['in_person', 'zoom', 'either'])
export const meetingStatus = pgEnum("meeting_status", ['pending', 'accepted', 'declined', 'canceled'])
export const role = pgEnum("role", ['student', 'tutor'])


export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	email: varchar().notNull(),
	password: varchar().notNull(),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	role: role().default('student').notNull(),
	meetingPreference: meetingPreference("meeting_preference").default('either').notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const tutorProfiles = pgTable("tutor_profiles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).primaryKey().notNull(),
	bio: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "tutor_profiles_user_id_fkey"
		}).onDelete("cascade"),
]);

export const studentProfiles = pgTable("student_profiles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "student_profiles_user_id_fkey"
		}).onDelete("cascade"),
]);

export const subjects = pgTable("subjects", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	code: varchar({ length: 32 }).notNull(),
	name: varchar({ length: 120 }).notNull(),
}, (table) => [
	unique("subjects_code_key").on(table.code),
]);

export const availabilitySlots = pgTable("availability_slots", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tutorId: bigint("tutor_id", { mode: "number" }).notNull(),
	weekday: smallint(),
	date: date(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	recurrenceRule: text("recurrence_rule"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.tutorId],
			foreignColumns: [users.id],
			name: "availability_slots_tutor_id_fkey"
		}).onDelete("cascade"),
	check("availability_slots_weekday_check", sql`(weekday >= 0) AND (weekday <= 6)`),
]);

export const meetingRequests = pgTable("meeting_requests", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	studentId: bigint("student_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tutorId: bigint("tutor_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	subjectId: bigint("subject_id", { mode: "number" }).notNull(),
	requestedStart: timestamp("requested_start", { mode: 'string' }).notNull(),
	requestedEnd: timestamp("requested_end", { mode: 'string' }).notNull(),
	mode: meetingMode().notNull(),
	topic: text(),
	status: meetingStatus().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [users.id],
			name: "meeting_requests_student_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.subjectId],
			foreignColumns: [subjects.id],
			name: "meeting_requests_subject_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tutorId],
			foreignColumns: [users.id],
			name: "meeting_requests_tutor_id_fkey"
		}).onDelete("cascade"),
]);

export const userSubjects = pgTable("user_subjects", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	subjectId: bigint("subject_id", { mode: "number" }).notNull(),
	role: role().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.subjectId],
			foreignColumns: [subjects.id],
			name: "user_subjects_subject_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_subjects_user_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.subjectId, table.role], name: "user_subjects_pkey"}),
]);
