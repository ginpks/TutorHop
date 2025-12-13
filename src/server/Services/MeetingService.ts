import { mapMeetingRequestFromBigint } from "../../shared/Mappers/MeetingMapper.js";
import {
  MeetingRepository,
  CreateMeetingDTO,
} from "../Repositories/MeetingRepo.js";

export class MeetingServices {
  private meetingRepo: MeetingRepository;

  constructor(private readonly MeetingRepo: MeetingRepository) {
    this.meetingRepo = MeetingRepo;
  }

  public async createMeetingRequest(rawReq: any) {
    const {
      studentId,
      tutorId,
      subjectId,
      requestedStart,
      requestedEnd,
      mode,
      topic,
    } = rawReq.body;

    if (
      !studentId ||
      !tutorId ||
      !subjectId ||
      !requestedStart ||
      !requestedEnd ||
      !mode
    ) {
      console.error("Missing required fields");
      throw new Error("Missing required fields");
    }

    if (mode !== "in_person" && mode !== "zoom") {
      console.log("Invalid mode:", mode);
      throw new Error("Invalid meeting mode. Must be 'in_person' or 'zoom'");
    }

    const dto: CreateMeetingDTO = {
      studentId: Number(studentId),
      tutorId: Number(tutorId),
      subjectId: Number(subjectId),
      requestedStart,
      requestedEnd,
      mode,
      topic: topic ?? null,
    };

    if (
      Number.isNaN(dto.studentId) ||
      Number.isNaN(dto.tutorId) ||
      Number.isNaN(dto.subjectId)
    ) {
      throw new Error("IDs must be numbers");
    }

    const meetingRequest = await this.meetingRepo.createMeetingInDB(dto);

    return mapMeetingRequestFromBigint(meetingRequest[0]);
  }
}
