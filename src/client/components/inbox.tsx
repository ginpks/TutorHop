import React from "react";
import { Box, Card, CardContent, List, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { MailPreviewMessages } from "../Interfaces/InboxInterfaces";

interface InboxCardComponentProps {
  userType: string;
  messages: MailPreviewMessages[];
}

function InboxCardComponent({
  userType,
  messages,
}: Readonly<InboxCardComponentProps>) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ margin: 10 }}>
        <Card sx={{ bgcolor: "#B4C5E4" }}>
          <CardContent>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              variant="h5"
              gutterBottom
            >
              <InboxIcon /> {userType} Inbox
            </Typography>
          </CardContent>
        </Card>
        <CardContent sx={{ minWidth: 300, minHeight: 200 }}>
          {messages?.length > 0 ? (
            <List sx={{ bgcolor: "white", flexGrow: 1 }}></List>
          ) : (
            <Typography color="text.secondary">
              No messages to display.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default InboxCardComponent;
