import previewRouter from "../routes/api/Inbox/inbox_preview.js";
import signUpRouter from "../routes/api/Account/signup.js";
import loginRouter from "../routes/api/Account/login.js";
import express from "express";
import profileInboxRouter from "../routes/api/Inbox/profile_inbox_endpoint.js";
import userDataRouter from "../routes/api/Account/user_data.js";
import tutorSearchRouter from "../routes/api/Tutor/search.js";
import meetingRequestRouter from "../routes/api/MeetingRequest/create.js";

export async function apiStart(mainApp: any) {
  mainApp.use(express.json());
  mainApp.use("/inbox", previewRouter);
  mainApp.use("/accounts", signUpRouter);
  mainApp.use("/accounts", loginRouter);
  mainApp.use("/profile-inbox", profileInboxRouter);
  mainApp.use("/accounts", userDataRouter);
  mainApp.use("/tutors", tutorSearchRouter);
  mainApp.use("/meeting-requests", meetingRequestRouter);
}
