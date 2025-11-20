import { meetingStatus } from "../../../drizzle/schema.js";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import { inboxPreviewMapper as inboxPreviewMapper } from "../../shared/Mappers/InboxMappers.js";
import { InboxRepository } from "../Repositories/InboxRepository.js";

export type MeetingStatus = (typeof meetingStatus.enumValues)[number];

const inbox_service: InboxServices | null = null;

export class InboxServices {
  constructor(private readonly inboxRepo: InboxRepository) {}

  public async inboxPreviews(
    userId: number,
    status?: MeetingStatus,
    startDate?: string,
    endDate?: string,
    fromStudent?: boolean,
  ): Promise<MailPreviewMessages[]> {
    const userInbox = await this.inboxRepo.getUserInbox(
      userId,
      status,
      startDate,
      endDate,
      fromStudent,
    );
    const previews: MailPreviewMessages[] = userInbox.map((message) =>
      inboxPreviewMapper(message),
    );
    return previews;
  }
}
