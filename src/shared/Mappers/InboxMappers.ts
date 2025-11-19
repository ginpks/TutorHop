import { meetingStatus } from "../../../drizzle/schema.js";
import { InboxRow } from "../../server/Repositories/InboxRepository.js";
import { MailPreviewMessages } from "../Interfaces/InboxInterfaces.js";

type MeetingStatus = (typeof meetingStatus.enumValues)[number];

export function inboxPreviewMapper(mail: InboxRow): MailPreviewMessages {
  return {
    id: mail.id.toString(),
    senderFirstName: mail.receiver?.firstName ?? undefined,
    senderLastName: mail.receiver?.lastName ?? undefined,
    subject: mail.subjects.name ?? undefined,
    timestamp: mail.createdAt,
    snippet: mail.subjects.topic ?? undefined,
  };
}
