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
