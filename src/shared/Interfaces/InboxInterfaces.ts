export interface MailPreviewMessages {
  id: string;
  senderFirstName: string | undefined;
  senderLastName?: string;
  subject: string | undefined;
  timestamp: string | Date;
  snippet?: string;
}
