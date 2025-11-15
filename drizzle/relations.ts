import { relations } from "drizzle-orm/relations";
import { users, tutorProfiles, studentProfiles, availabilitySlots, meetingRequests, subjects, userSubjects } from "./schema";

export const tutorProfilesRelations = relations(tutorProfiles, ({one}) => ({
	user: one(users, {
		fields: [tutorProfiles.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	tutorProfiles: many(tutorProfiles),
	studentProfiles: many(studentProfiles),
	availabilitySlots: many(availabilitySlots),
	meetingRequests_studentId: many(meetingRequests, {
		relationName: "meetingRequests_studentId_users_id"
	}),
	meetingRequests_tutorId: many(meetingRequests, {
		relationName: "meetingRequests_tutorId_users_id"
	}),
	userSubjects: many(userSubjects),
}));

export const studentProfilesRelations = relations(studentProfiles, ({one}) => ({
	user: one(users, {
		fields: [studentProfiles.userId],
		references: [users.id]
	}),
}));

export const availabilitySlotsRelations = relations(availabilitySlots, ({one}) => ({
	user: one(users, {
		fields: [availabilitySlots.tutorId],
		references: [users.id]
	}),
}));

export const meetingRequestsRelations = relations(meetingRequests, ({one}) => ({
	user_studentId: one(users, {
		fields: [meetingRequests.studentId],
		references: [users.id],
		relationName: "meetingRequests_studentId_users_id"
	}),
	subject: one(subjects, {
		fields: [meetingRequests.subjectId],
		references: [subjects.id]
	}),
	user_tutorId: one(users, {
		fields: [meetingRequests.tutorId],
		references: [users.id],
		relationName: "meetingRequests_tutorId_users_id"
	}),
}));

export const subjectsRelations = relations(subjects, ({many}) => ({
	meetingRequests: many(meetingRequests),
	userSubjects: many(userSubjects),
}));

export const userSubjectsRelations = relations(userSubjects, ({one}) => ({
	subject: one(subjects, {
		fields: [userSubjects.subjectId],
		references: [subjects.id]
	}),
	user: one(users, {
		fields: [userSubjects.userId],
		references: [users.id]
	}),
}));