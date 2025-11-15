import { meetingStatus } from "../../../drizzle/schema.js";
import { InboxRow } from "../../server/Repositories/InboxRepository.js";
import { MailPreviewMessages } from "../Interfaces/InboxInterfaces.js";

type MeetingStatus = (typeof meetingStatus.enumValues)[number];

export function studentInboxPreviewMapper(mail: InboxRow): MailPreviewMessages {
  return {
    id: mail.id.toString(),
    sender: mail.tutorId.toString(),
    subject: mail.subjectId.toString(),
    timestamp: mail.createdAt,
    snippet: mail.topic ?? undefined,
  };
}

export function tutorInboxPreviewMapper(mail: InboxRow): MailPreviewMessages {
  return {
    id: mail.id.toString(),
    sender: mail.studentId.toString(),
    subject: mail.subjectId.toString(),
    timestamp: mail.createdAt,
    snippet: mail.topic ?? undefined,
  };
}
