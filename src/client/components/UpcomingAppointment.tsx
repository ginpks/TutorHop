import React from "react";
import { Box, Card, CardContent, List, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces";
import { UserRole } from "../../shared/Enums/UserEnums";

interface UpcomingAppointmentProps {
  userType: UserRole;
  appointments: MailPreviewMessages[];
}

function UpcomingAppointment({
  userType,
  appointments,
}: Readonly<UpcomingAppointmentProps>) {
  return <Card></Card>;
}

export default UpcomingAppointment;
