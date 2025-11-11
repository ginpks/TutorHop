import { meetingStatus } from "../../../drizzle/schema.js";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import {
  studentInboxPreviewMapper,
  tutorInboxPreviewMapper,
} from "../../shared/Mappers/InboxMappers.js";
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
    fromStudent?: boolean
  ): Promise<MailPreviewMessages[]> {
    const userInbox = await this.inboxRepo.getUserInbox(
      userId,
      status,
      startDate,
      endDate,
      fromStudent
    );
    if (fromStudent) {
      const previews: MailPreviewMessages[] = userInbox.map((message) =>
        tutorInboxPreviewMapper(message)
      );
      return previews;
    } else {
      const previews: MailPreviewMessages[] = userInbox.map((message) =>
        studentInboxPreviewMapper(message)
      );
      return previews;
    }
  }
}
