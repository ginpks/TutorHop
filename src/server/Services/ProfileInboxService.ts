import { meetingStatus } from "../../../drizzle/schema.js";
import { MailFullMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import { inboxFullMapper } from "../../shared/Mappers/InboxMappers.js";
import { ProfileInboxRepository } from "../Repositories/ProfileInboxRepository.js";

export type MeetingStatus = (typeof meetingStatus.enumValues)[number];

const inbox_service: ProfileInboxServices | null = null;

export class ProfileInboxServices {
  constructor(private readonly inboxRepo: ProfileInboxRepository) {}

  public async inboxPreviews(
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
}
