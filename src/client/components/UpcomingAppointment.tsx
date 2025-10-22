import React from "react";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
interface UpcomingAppointmentProps {
  userType: string;
  appointments: MailPreviewMessages[];
}

function UpcomingAppointment({
  userType,
  appointments,
}: Readonly<UpcomingAppointmentProps>) {
  return (
    <Box sx={{ margin: 5, width: "40vw", height: "12vh", padding: 0 }}>
      <Card sx={{ bgcolor: "transparent", boxShadow: "none", padding: 0 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignContent: "center" }}>
            <BusinessCenterIcon />
            <Typography variant="h5">Upcoming Appointments</Typography>
          </Box>
        </CardContent>
      </Card>
      {appointments.length < 1 ? (
        <Card>
          <CardContent
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Typography>No upcoming appointments</Typography>
          </CardContent>
        </Card>
      ) : (
        appointments.map((element) => {
          return (
            <Card key={element.id}>
              <CardContent>
                <Typography>{element.subject}</Typography>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}

export default UpcomingAppointment;
