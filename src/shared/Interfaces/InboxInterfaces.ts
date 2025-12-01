export interface MailPreviewMessages {
  id: string;
  senderFirstName: string | undefined;
  senderLastName?: string;
  subject: string | undefined;
  timestamp: string | Date;
  snippet?: string;
}

export interface MailFullMessages {
  id: string;
  senderFirstName: string | undefined;
  senderLastName?: string | undefined;
  subject: string | undefined;
  timestamp: string | Date;
  snippet?: string;

  requestedStart?: string | Date;
  requestedEnd?: string | Date;
  status?: string | undefined;
  meetingMode?: string | undefined;
}
