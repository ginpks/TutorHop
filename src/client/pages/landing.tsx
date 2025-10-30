import { Box, Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import DefaultBanner from "../components/main_banner/banner";
import InboxCardComponent from "../components/inbox";
import React from "react";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces";
import { roleLabels, UserRole } from "../../shared/Enums/UserEnums";
import UpcomingAppointment from "../components/UpcomingAppointment";
import UserSearchBar from "../components/SearchBar";

function Landing() {
  const [messages, setMessages] = React.useState<MailPreviewMessages[]>([]);

  return (
    <Card
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        alignItems: "top",
        bgcolor: "#FBFFF1",
        border: "none",
        boxShadow: "none",
      }}
    >
      <DefaultBanner
        title="Tutor Hop"
        profilePicUrl=""
        displayName="John Doe"
      />

      <Box sx={{ display: "flex" }}>
        <InboxCardComponent
          userType={roleLabels[UserRole?.STUDENT]}
          messages={messages}
        />
        <UpcomingAppointment
          userType={roleLabels[UserRole?.STUDENT]}
          appointments={[]}
        />
      </Box>
      {/* <Box>
        <UserSearchBar userType={roleLabels[UserRole?.STUDENT]}></UserSearchBar>
      </Box> */}
    </Card>
  );
}

export default Landing;
