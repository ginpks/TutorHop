import { MeetingRequest } from "../Interfaces/AppointmentInterfaces.js";

export function mapMeetingRequestFromBigint(raw: {
  studentId: number;
  tutorId: number;
  subjectId: number;
  requestedStart: string;
  requestedEnd: string;
  mode: "in_person" | "zoom";
  topic: string | null;
  id: bigint;
  status: "pending" | "accepted" | "declined" | "canceled";
  createdAt: string;
  updatedAt: string;
}): MeetingRequest {
  const result: MeetingRequest = {
    studentId: raw.studentId,
    tutorId: raw.tutorId,
    subjectId: raw.subjectId,
    requestedStart: raw.requestedStart,
    requestedEnd: raw.requestedEnd,
    mode: raw.mode,
    topic: raw.topic,
    id: Number(raw.id),
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
  return result;
}
