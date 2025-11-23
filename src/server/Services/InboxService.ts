import { meetingStatus } from "../../../drizzle/schema.js";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import { inboxPreviewMapper as inboxPreviewMapper } from "../../shared/Mappers/InboxMappers.js";
import { InboxRepository } from "../Repositories/InboxRepository.js";

const inbox_service: AccountServices | null = null;

export class AccountServices {
  constructor(private readonly inboxRepo: InboxRepository) {}
}
