import { meetingStatus } from "../../../drizzle/schema.js";
import { InboxRow } from "../../server/Repositories/ProfileInboxRepository.js";
import {
  MailPreviewMessages,
  MailFullMessages,
} from "../Interfaces/InboxInterfaces.js";

type MeetingStatus = (typeof meetingStatus.enumValues)[number];

export function inboxPreviewMapper(mail: any): MailPreviewMessages {
  console.log("mail", mail);
  return {
    id: mail.id.toString(),
    senderFirstName: mail.receiver?.firstName ?? undefined,
    senderLastName: mail.receiver?.lastName ?? undefined,
    subject: mail.subjects.name ?? undefined,
    startDate: mail.requestedStart,
    snippet: mail.subjects.topic ?? undefined,
  };
}

export function inboxFullMapper(mail: InboxRow): MailFullMessages {
  return {
    id: mail.id.toString(),
    senderFirstName: mail.receiver?.firstName ?? undefined,
    senderLastName: mail.receiver?.lastName ?? undefined,
    subject: mail.subjects.name ?? undefined,
    timestamp: mail.createdAt,
    snippet: mail.subjects.topic ?? undefined,

    requestedStart: mail.requestedStart ?? undefined,
    requestedEnd: mail.requestedEnd ?? undefined,
    status: mail.status ?? undefined,
    meetingMode: mail.meetingMode ?? undefined,
  };
}
