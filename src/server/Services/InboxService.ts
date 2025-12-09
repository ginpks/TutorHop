import { meetingStatus } from "../../../drizzle/schema.js";
import { MailPreviewMessages, MailFullMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import { inboxPreviewMapper, inboxFullMapper } from "../../shared/Mappers/InboxMappers.js";
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
    //retrieve raw data from the repo/database
    const userInbox = await this.inboxRepo.getUserInbox(
      userId,
      status,
      startDate,
      endDate,
      fromStudent
    );
    //map it or modify it as you please and then return it.
    const previews: MailPreviewMessages[] = userInbox.map((message) =>
      inboxPreviewMapper(message)
    );
    return previews;
  }

  public async inboxFull(
    userId: number,
    status?: MeetingStatus,
    startDate?: string,
    endDate?: string,
    fromStudent?: boolean,
  ): Promise<MailFullMessages[]> {
    //retrieve raw data from the repo/database
    const userInbox = await this.inboxRepo.getUserInbox(
      userId,
      status,
      startDate,
      endDate,
      fromStudent,
    );
    //map it or modify it as you please and then return it.
    const fullMessages: MailFullMessages[] = userInbox.map((message) =>
      inboxFullMapper(message),
    );
    return fullMessages;
  }

  public async meetingService(
    meetingRequestId: number,
    answer: MeetingStatus,
  ): Promise<any> {
    
    try {
      const updated = await this.inboxRepo.updateMeetingStatus(
        meetingRequestId,
        answer
      );

    return updated;
    } catch (err) {
      console.error("Error inside meetingService:", err);
      throw err;
    }
  }
}
