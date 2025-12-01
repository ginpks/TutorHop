import previewRouter from "../routes/api/Inbox/inbox_preview.js";
import signUpRouter from "../routes/api/Account/sign_up.js";
import loginRouter from "../routes/api/Account/login.js";
import express from "express";

export async function apiStart(mainApp: any) {
  mainApp.use(express.json());
  mainApp.use("/inbox", previewRouter);
  mainApp.use("/accounts", signUpRouter);
  mainApp.use("/accounts", loginRouter);
}
