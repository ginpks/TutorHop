import previewRouter from "../routes/api/Inbox/inbox_preview.js";
import signUpRouter from "../routes/api/Account/signup.js";
import loginRouter from "../routes/api/Account/login.js";
import express from "express";
import userDataRouter from "../routes/api/Account/user_data.js";
import tutorSearchRouter from "../routes/api/Tutor/search.js";
import meetingRequestRouter from "../routes/api/MeetingRequest/create.js";
import appointmentsRouter from "../routes/api/Inbox/upcoming_apps.js";
import meetingDecisionRouter from "../routes/api/MeetingRequest/meeting_req_acc_den.js";

export async function apiStart(mainApp: any) {
  mainApp.use(express.json());
  mainApp.use("/inbox", appointmentsRouter);
  mainApp.use("/inbox", previewRouter);
  mainApp.use("/accounts", signUpRouter);
  mainApp.use("/accounts", loginRouter);
  mainApp.use("/accounts", userDataRouter);
  mainApp.use("/tutors", tutorSearchRouter);
  mainApp.use("/meeting-requests", meetingRequestRouter);
  mainApp.use("/accept-deny", meetingDecisionRouter);
}
