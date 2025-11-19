import previewRouter from "../routes/api/Inbox/inbox_preview.js";

export async function apiStart(mainApp: any) {
  mainApp.use("/inbox", previewRouter);
}
