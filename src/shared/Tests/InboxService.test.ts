import { InboxServices } from '../../server/Services/InboxService.js';
import { InboxRepository } from '../../server/Repositories/InboxRepository.js';
import { inboxPreviewMapper } from '../Mappers/InboxMappers.js';
import mockInboxData from '../../server/mock/student_inbox.json' with { type: "json" };

/* 
  Some general tips:
  Each test case (an it() function) takes an empty function that performs tests.
  Test cases are contained in a test class (describe())

  1. Use expect(bool) for basic boolean assertions
  2. If the tested service has a dependency, mock it as seen below.
  3. Clear all mocks between runs as seen below.
  4. If returning a promise:
    - Mark the test case function as async
    - Use await for resulting data
    - Cannot use regular expect(bool), use expect(result/service).[insert test function]
    - expect() has a lot of properties that can be used to test a wide range of things. Some are contained below
      and others can be found at this link https://jest-bot.github.io/jest/docs/expect.html
    - You can also test resolved values by using expect(data).resolves.toBe(...), same with .rejects
*/

// Mock the mapper so we can control its behavior
jest.mock('../Mappers/InboxMappers.js', () => ({
  inboxPreviewMapper: jest.fn(),
}));

// Define a test class
describe('InboxServices with JSON mock data', () => {
  // Create a mock repository
  const mockRepo: jest.Mocked<Partial<InboxRepository>> = {
    getUserInbox: jest.fn(),
  };

  // Instantiate a service to test (using the mock repo)
  const service = new InboxServices(mockRepo as unknown as InboxRepository);

  // Reset mocks before each run of the test class
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

  // Define a test case
  it('should map inbox rows into preview messages', async () => {
    // Mock the value returned by the repo as the mock data
    (mockRepo.getUserInbox as jest.Mock).mockResolvedValue(mockInboxData as any[]);

    const result = await service.inboxPreviews(123);

    // Test expected input
    expect(mockRepo.getUserInbox).toHaveBeenCalledWith(
      123,
      undefined,
      undefined,
      undefined,
      undefined
    );
    // How many times it was called
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