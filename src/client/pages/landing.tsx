import { Box, Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import DefaultBanner from "../components/main_banner/banner";
import InboxCardComponent from "../components/inbox";
import React, { useEffect, useState } from "react";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces";
import { roleLabels, UserRole } from "../../shared/Enums/UserEnums";
import UpcomingAppointment from "../components/UpcomingAppointment";
import UserSearchBar from "../components/SearchBar";

function Landing() {
  const [messages, setMessages] = React.useState<MailPreviewMessages[]>([]);
  const [userID, setUserID] = React.useState<number>(0);

  useEffect(() => {
    setUserID(1);

    async function load() {
      const res = await fetch(`/api/inbox/${userID}/preview`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          status: ``,
          startDate: ``,
          endDate: ``,
          fromStudent: ``,
        },
      });
      const data = (await res.json()) as MailPreviewMessages[];
      setMessages(data);
    }
    load();
  });

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
        <Box
          sx={{
            display: "flex",
            overflowY: "scroll",
            borderRadius: "10px",
            boxShadow: "inset 0 0 10px grey",
            margin: 5,
            width: "40vw",
            bgcolor: "#D3D3D3",
          }}
        >
          <UpcomingAppointment
            userType={roleLabels[UserRole?.STUDENT]}
            appointments={[]}
          />
        </Box>
      </Box>
      {/* <Box>
        <UserSearchBar userType={roleLabels[UserRole?.STUDENT]}></UserSearchBar>
      </Box> */}
    </Card>
  );
}

export default Landing;
