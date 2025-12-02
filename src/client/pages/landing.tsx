import { Box, Card, CardActions } from "@mui/material";
import Grid from "@mui/material/Grid";
import DefaultBanner from "../components/main_banner/banner.js";
import InboxCardComponent from "../components/LandingInbox.js";
import React, { useEffect, useState } from "react";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import { roleLabels, UserRole } from "../../shared/Enums/UserEnums.js";
import UpcomingAppointment from "../components/UpcomingAppointment.js";
import PrimaryButton from "../components/primary-button.js";
import UserSearchBar from "../components/SearchBar.js";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [messages, setMessages] = React.useState<MailPreviewMessages[]>([]);
  const [userID, setUserID] = React.useState<number>(0);
  const [isTutor, setIsTutor] = React.useState<boolean>(false);
  const [loadingInbox, setLoadingInbox] = React.useState<boolean>(true);
  const [upcoming, setUpcoming] = React.useState<MailPreviewMessages[]>([])
  const createReq = () => {
      useNavigate()("/survey");
    };

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

        const res2 = await fetch(`/appointments/${userID}/upcoming?${query.toString()}`);

        if(!res2.ok) {
          const text = await res2.text();
          console.error("HTTP error", res2.status, text.slice(0, 300));
          throw new Error(`HTTP ${res2.status}`);
        }
        
        const data = (await res.json()) as MailPreviewMessages[];
        const apps = (await res2.json()) as MailPreviewMessages[];

        setMessages(data);
        setUpcoming(apps);
        setLoadingInbox(false);
      } catch (err) {
        console.error("Inbox fetch error: ", err);
      }
    }
    load();
  }, [userID]);

  return (
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
            appointments={upcoming}
          />
        </Box>
      </Box>
      {/* <Box>
        <UserSearchBar userType={roleLabels[UserRole?.STUDENT]}></UserSearchBar>
      </Box> */}
      <Box display={"flex"} justifyContent={"center"}>
        <PrimaryButton px={20} text="Request New Appointment" onClick={createReq}/>
      </Box>
      
    </Box>
    
  );
}

export default Landing;
