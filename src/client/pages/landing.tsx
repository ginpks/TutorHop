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
    if (!userID) return;
    async function load() {
      try {
        const query = new URLSearchParams({});

        const res = await fetch(`/inbox/${userID}/preview?${query.toString()}`);

        if (!res.ok) {
          const text = await res.text();
          console.error("HTTP error", res.status, text.slice(0, 300));
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as MailPreviewMessages[];
        console.log("Data", data);
        setMessages(data);
      } catch (err) {
        console.error("Inbox fetch error: ", err);
      }
    }
    load();
  }, [userID]);

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

      <Box sx={{ display: "flex", flexShrink: 0, flexGrow: 1 }}>
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
