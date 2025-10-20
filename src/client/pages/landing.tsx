import { Card } from "@mui/material";
import Grid from "@mui/material/Grid";
import DefaultBanner from "../components/main_banner/banner";
import InboxCardComponent from "../components/inbox";
import React from "react";
import { MailPreviewMessages } from "../Interfaces/InboxInterfaces";

function Landing() {
  const [messages, setMessages] = React.useState<MailPreviewMessages[]>([]);

  return (
    <Card
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
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

      <Grid container spacing={12}>
        <InboxCardComponent userType="Student" messages={messages} />
      </Grid>
    </Card>
  );
}

export default Landing;
