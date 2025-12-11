import React from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces.js";
import { OutboxOutlined } from "@mui/icons-material";

interface InboxCardComponentProps {
  userType: string;
  messages: MailPreviewMessages[];
  onClick?: (mail: MailPreviewMessages) => void;
  loading?: boolean;
}

function InboxCardComponent({
  userType,
  messages,
  onClick,
  loading,
}: Readonly<InboxCardComponentProps>) {
  function inboxDataReturn() {
    if (messages.length > 0 && loading === false) {
      return (
        <CardContent>
          <List sx={{ bgcolor: "background.paper", flexGrow: 1 }}>
            {messages.map((element) => {
              return (
                <ListItemButton
                  onClick={() => onClick?.(element)}
                  key={element.id}
                  sx={{
                    boxShadow: "0px 2px 0px grey;",
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontWeight: "bold" }}
                    >{`${element.senderFirstName} ${element.senderLastName}`}</Typography>
                  </Box>
                  <Box sx={{}}>
                    <Typography
                      sx={{ fontWeight: "bold" }}
                    >{`${element.subject}`}</Typography>
                    <ListItemText sx={{}}>{`${element.snippet}`}</ListItemText>
                  </Box>
                </ListItemButton>
              );
            })}
          </List>
        </CardContent>
      );
    } else if (messages.length === 0 && loading === false) {
      return (
        <CardContent
          sx={{
            minWidth: 300,
            minHeight: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">
            No messages to display.
          </Typography>
        </CardContent>
      );
    } else if (loading === true) {
      return (
        <Box sx={{ display: "flex", justifySelf: "center", padding: "20px" }}>
          <CircularProgress />
        </Box>
      );
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{ margin: 5, width: "40vw", minHeight: "40vh", maxHeight: "50vh" }}
      >
        <Card sx={{ bgcolor: "#B4C5E4" }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            {userType === "tutor" ? (
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                variant="h5"
                gutterBottom
              >
                <InboxIcon /> {userType} Inbox
              </Typography>
            ) : (
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                variant="h5"
                gutterBottom
              >
                <OutboxOutlined /> Outgoing Meeting Requests
              </Typography>
            )}
          </CardContent>
        </Card>
        {inboxDataReturn()}
      </Card>
    </Box>
  );
}

export default InboxCardComponent;
