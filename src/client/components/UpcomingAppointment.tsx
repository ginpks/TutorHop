import React from "react";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
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
    <Box sx={{ margin: 5, width: "40vw", padding: 0 }}>
      <Card sx={{ bgcolor: "transparent", boxShadow: "none", padding: 0 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessCenterIcon sx={{ color: "#3C3744" }} />
          <Typography variant="h5" fontWeight="bold" color="#3C3744">
            Upcoming Appointments
          </Typography>
        </CardContent>
      </Card>
      {appointments.length < 1 ? (
        <Card>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              py: 4,
            }}
          >
            <BusinessCenterIcon
              sx={{ fontSize: 44, color: "rgba(60, 55, 68, 0.25)" }}
            />
            <Typography color="text.secondary">
              No upcoming appointments
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List disablePadding>
          {appointments.map((element) => {
            return (
              <Card
                key={element.id}
                sx={{
                  marginBottom: 2,
                  marginTop: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 18px rgba(60, 55, 68, 0.14)",
                    borderColor: "rgba(180, 197, 228, 0.6)",
                  },
                }}
              >
                <CardContent sx={{ display: "flex", gap: 3, py: 2 }}>
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "rgba(180, 197, 228, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      color: "#3C3744",
                      fontSize: "1rem",
                    }}
                  >
                    {(element.senderFirstName || "?").charAt(0).toUpperCase()}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{ fontWeight: "bold" }}
                    >{`${element.senderFirstName} ${element.senderLastName}`}</Typography>
                    <Typography
                      noWrap
                      sx={{ fontWeight: "bold" }}
                    >{`${element.subject}`}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >{`${element.snippet ?? "No Preview"}`}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >{`${element.startDate ?? "No date provided"}`}</Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </List>
      )}
    </Box>
  );
}

export default UpcomingAppointment;
