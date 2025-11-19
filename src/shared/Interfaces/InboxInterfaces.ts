export interface MailPreviewMessages {
  id: string;
  senderFirstName: string | undefined;
  senderLastName?: string | undefined;
  subject: string | undefined;
  timestamp: string | Date;
  snippet?: string;
}
