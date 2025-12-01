import { InboxServices } from './InboxService.js';
import { InboxRepository } from '../Repositories/InboxRepository.js';
import { inboxPreviewMapper } from '../../shared/Mappers/InboxMappers.js';
import mockInboxData from '../mock/student_inbox.json' with { type: "json" };

jest.mock('../Mappers/InboxMappers.js', () => ({
  inboxPreviewMapper: jest.fn(),
}));

describe('InboxServices with JSON mock data', () => {
  const mockRepo: jest.Mocked<Partial<InboxRepository>> = {
    getUserInbox: jest.fn(),
  };

  const service = new InboxServices(mockRepo as unknown as InboxRepository);

  beforeEach(() => {
    jest.clearAllMocks();
    (inboxPreviewMapper as jest.Mock).mockImplementation((row: any) => ({
      id: row.id.toString(),
      senderFirstName: row.receiver?.firstName,
      senderLastName: row.receiver?.lastName,
      subject: row.subjects?.name,
      timestamp: row.createdAt,
      snippet: row.subjects?.topic,
    }));
  });

  it('should map inbox rows into preview messages', async () => {
    (mockRepo.getUserInbox as jest.Mock).mockResolvedValue(mockInboxData as any[]);

    const result = await service.inboxPreviews(123);

    expect(mockRepo.getUserInbox).toHaveBeenCalledWith(
      123,
      undefined,
      undefined,
      undefined,
      undefined
    );
    expect(inboxPreviewMapper).toHaveBeenCalledTimes(mockInboxData.length);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('subject');
  });

  it('should handle empty inbox gracefully', async () => {
    (mockRepo.getUserInbox as jest.Mock).mockResolvedValue([]);

    const result = await service.inboxPreviews(456);

    expect(result).toEqual([]);
    expect(inboxPreviewMapper).not.toHaveBeenCalled();
  });
});