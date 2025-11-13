import React from "react";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import { MailPreviewMessages } from "../../shared/Interfaces/InboxInterfaces";

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
      <Card sx={{ margin: 5, width: "40vw" }}>
        <Card sx={{ bgcolor: "#B4C5E4" }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              variant="h5"
              gutterBottom
            >
              <InboxIcon /> {userType} Inbox
            </Typography>
          </CardContent>
        </Card>
        {messages?.length > 0 ? (
          <CardContent>
            <List sx={{ bgcolor: "background.paper", flexGrow: 1 }}>
              {messages.map((element) => {
                return (
                  <ListItem
                    key={element.id}
                    sx={{ boxShadow: "0px 2px 0px grey;" }}
                  >
                    <Typography>
                      {`Sender: ${element.sender}
                      Timestamp: ${element.timestamp}`}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        ) : (
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
        )}
      </Card>
    </Box>
  );
}

export default InboxCardComponent;
