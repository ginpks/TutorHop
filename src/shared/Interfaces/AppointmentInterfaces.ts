export interface StudentAppointmentPreview {
  id: string;
  courseName: string;
  courseCode: string;
  tutorName: string;
  date?: string;
  time?: string;
}
export interface TutorAppointmentPreview {
  id: string;
  courseName: string;
  courseCode: string;
  studentName: string;
  date?: string;
  time?: string;
}

export interface MeetingRequest {
  studentId: number;
  tutorId: number;
  subjectId: number;
  requestedStart: string;
  requestedEnd: string;
  mode: "in_person" | "zoom";
  topic: string | null;
  id: number;
  status: "pending" | "accepted" | "declined" | "canceled";
  createdAt: string;
  updatedAt: string;
}
