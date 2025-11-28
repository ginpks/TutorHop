import previewRouter from "../routes/api/Inbox/inbox_preview.js";
import profileInboxRouter from "../routes/api/Inbox/profile_inbox_endpoint.js";

export async function apiStart(mainApp: any) {
  mainApp.use("/inbox", previewRouter);
  mainApp.use("/profile-inbox", profileInboxRouter);
}
