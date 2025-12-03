import { Box, Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import DefaultBanner from "../components/main_banner/banner.js";
import InboxCardComponent from "../components/LandingInbox.js";
import React, { useEffect, useState } from "react";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import { roleLabels, UserRole } from "../../shared/Enums/UserEnums.js";
import UpcomingAppointment from "../components/UpcomingAppointment.js";
import UserSearchBar from "../components/SearchBar.js";
import { AuthProvider } from "../components/AuthenticationComponent.js";
import { useLocation } from "react-router-dom";

function Landing() {
  const [messages, setMessages] = React.useState<MailPreviewMessages[]>([]);
  const [userID, setUserID] = React.useState<number>(0);
  const [isTutor, setIsTutor] = React.useState<boolean>(false);
  const [loadingInbox, setLoadingInbox] = React.useState<boolean>(true);
  const { token } = useLocation().state || {};
  useEffect(() => {
    //set a test user
    setUserID(5);
    if (!userID) return;
    async function load() {
      //set the inbox as loading to display wheel
      setLoadingInbox(true);
      try {
        //define the data params to send to the endpoint
        const query = new URLSearchParams({
          tutor: isTutor === true ? "true" : "false",
          status: "pending",
        });
        //fetch the endpoint using the params
        const res = await fetch(`/inbox/${userID}/preview?${query.toString()}`);

        if (!res.ok) {
          const text = await res.text();
          console.error("HTTP error", res.status, text.slice(0, 300));
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as MailPreviewMessages[];
        setMessages(data);
        setLoadingInbox(false);
      } catch (err) {
        console.error("Inbox fetch error: ", err);
      }
    }
    load();
  }, [userID]);

  return (
    <AuthProvider token={token.state}>
      <Box
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
          isLoggedIn
        />

        <Box sx={{ display: "flex", flexShrink: 0, flexGrow: 1 }}>
          <InboxCardComponent
            userType={roleLabels[UserRole?.STUDENT]}
            messages={messages}
            loading={loadingInbox}
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
      </Box>
    </AuthProvider>
  );
}

export default Landing;
