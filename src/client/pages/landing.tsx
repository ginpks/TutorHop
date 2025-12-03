import { Box } from "@mui/material";
import DefaultBanner from "../components/main_banner/banner";
import InboxCardComponent from "../components/LandingInbox";
import React, { useEffect } from "react";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces";
import { roleLabels, UserRole } from "../../shared/Enums/UserEnums";
import UpcomingAppointment from "../components/UpcomingAppointment";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [messages, setMessages] = React.useState<MailPreviewMessages[]>([]);
  const [upcoming, setUpcoming] = React.useState<MailPreviewMessages[]>([]);
  const [userID, setUserID] = React.useState<number>(0);
  const [isTutor, setIsTutor] = React.useState<boolean>(false);
  const [loadingInbox, setLoadingInbox] = React.useState<boolean>(true);
  const [userName, setUserName] = React.useState<string>("");
  const [userRole, setUserRole] = React.useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Token check is handled by ProtectedRoute wrapper
    setUserID(5);

    // Get user data from localStorage or token
    const token = localStorage.getItem("token");
    if (token) {
      // Decode JWT to get user info
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserName(payload.email || "User");
        setUserRole(payload.role || "student");
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  const handleProfileClick = () => {
    if (userRole === "tutor") {
      navigate("/tutorprofile");
    } else {
      navigate("/studentprofile");
    }
  };

  useEffect(() => {
    if (!userID) return;

    async function load() {
      setLoadingInbox(true);
      try {
        const query = new URLSearchParams({
          tutor: isTutor === true ? "true" : "false",
          status: "pending",
        });

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
      } catch (err) {
        console.error("Inbox fetch error: ", err);
      } finally {
        setLoadingInbox(false);
      }
    }
    load();
  }, [userID, isTutor]);

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
        displayName={userName}
        isLoggedIn
        onProfileClick={handleProfileClick}
        userType={roleLabels[userRole as UserRole] || "Student"}
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
    </Box>
    
  );
}

export default Landing;
