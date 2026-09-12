import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
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
          <List sx={{ bgcolor: "background.paper", flexGrow: 1 }} disablePadding>
            {messages.map((element) => {
              return (
                <ListItemButton
                  onClick={() => onClick?.(element)}
                  key={element.id}
                  sx={{
                    display: "flex",
                    gap: 4,
                    px: 2.5,
                    py: 1.75,
                    borderRadius: 2,
                    mb: 1,
                    border: "1px solid rgba(60, 55, 68, 0.08)",
                    bgcolor: "#fff",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(180, 197, 228, 0.15)",
                      borderColor: "rgba(180, 197, 228, 0.6)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(60, 55, 68, 0.1)",
                    },
                  }}
                >
                  <Box sx={{ flexShrink: 0, width: 150 }}>
                    <Typography
                      noWrap
                      sx={{ fontWeight: "bold" }}
                    >{`${element.senderFirstName} ${element.senderLastName}`}</Typography>
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      {`${element.subject}`}
                    </Typography>
                    <ListItemText
                      primaryTypographyProps={{
                        sx: { color: "text.secondary", fontSize: "0.875rem" },
                      }}
                    >{`${element.snippet}`}</ListItemText>
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <InboxIcon sx={{ fontSize: 44, color: "rgba(60, 55, 68, 0.25)" }} />
          <Typography color="text.secondary">No messages to display.</Typography>
        </CardContent>
      );
    } else if (loading === true) {
      return (
        <Box sx={{ display: "flex", justifySelf: "center", padding: "20px" }}>
          <CircularProgress size={32} sx={{ color: "#3D52D5" }} />
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
        sx={{
          margin: 5,
          width: "40vw",
          minHeight: "40vh",
          maxHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Card
          sx={{
            bgcolor: "#B4C5E4",
            borderRadius: "12px 12px 0 0",
            boxShadow: "none",
            backgroundImage: "none",
          }}
        >
          <CardContent
            sx={{ display: "flex", alignItems: "center", gap: 1, py: 2 }}
          >
            {userType === "tutor" ? (
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                variant="h5"
                fontWeight="bold"
                color="#3C3744"
              >
                <InboxIcon /> {userType} Inbox
              </Typography>
            ) : (
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                variant="h5"
                fontWeight="bold"
                color="#3C3744"
              >
                <OutboxOutlined /> Outgoing Meeting Requests
              </Typography>
            )}
            {messages.length > 0 && loading === false && (
              <Chip
                label={messages.length}
                size="small"
                sx={{
                  ml: 1.5,
                  bgcolor: "rgba(60, 55, 68, 0.85)",
                  color: "#fff",
                  fontWeight: 700,
                }}
              />
            )}
          </CardContent>
        </Card>
        <Box sx={{ overflowY: "auto", flexGrow: 1 }}>{inboxDataReturn()}</Box>
      </Card>
    </Box>
  );
}

export default InboxCardComponent;
