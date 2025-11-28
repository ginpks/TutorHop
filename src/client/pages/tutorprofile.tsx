import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect } from "react";
import { MailFullMessages } from "../../shared/Interfaces/InboxInterfaces";

interface PendingRequest {
  student: string;
  subject: string;
  status?: "Pending" | "Accepted" | "Rejected";
}

interface TutorProfileProps {
  name?: string;
  email?: string;
  subjects?: string[];
  pendingRequests?: PendingRequest[];
  meetingMode?: string;
}

const BG = "#FBFFF1"; // pale yellow background
const HEADER_PILL = "#B9C1E9"; // light indigo header pill
const SECTION_BG = "#E9F4F4"; // bluish card sections
const TEXT_DARK = "#3C3744"; // strong text color

const Pill = ({ label }: { label: string }) => (
  <Box
    component="span"
    sx={{
      px: 1.25,
      py: 0.5,
      borderRadius: 999,
      bgcolor: "#E5E7EB",
      color: TEXT_DARK,
      fontSize: 14,
      fontWeight: 600,
      display: "inline-block",
      minWidth: 64,
      textAlign: "center",
    }}
  >
    {label}
  </Box>
);

const StatusChip = ({
  status,
}: {
  status: "Pending" | "Accepted" | "Rejected";
}) => (
  <Chip
    label={status}
    size="small"
    sx={{
      borderRadius: 999,
      fontWeight: 600,
      bgcolor:
        status === "Accepted"
          ? "#E0F2E9"
          : status === "Rejected"
            ? "#FBEAEA"
            : "#FFF4E5",
      color:
        status === "Accepted"
          ? "#2E7D32"
          : status === "Rejected"
            ? "#B00020"
            : "#E65100",
    }}
  />
);

const Section: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: SECTION_BG,
      p: { xs: 2, sm: 3 },
      borderRadius: 2,
      width: "100%",
    }}
  >
    {title && (
      <Typography
        variant="h6"
        sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1 }}
      >
        {title}
      </Typography>
    )}
    {children}
  </Paper>
);

const TutorProfile: React.FC<TutorProfileProps> = ({
  name = "John Doe",
  email = "johndoe@umass.edu",
  subjects = ["CS 240", "CS 311"],
  pendingRequests = [
    { student: "Sam Lee", subject: "CS 230", status: "Pending" },
    { student: "Ava Smith", subject: "CS 311", status: "Accepted" },
  ],
  meetingMode = "Hybrid",
}) => {

  const [messages, setMessages] = React.useState<MailFullMessages[]>([]);
  const [userID, setUserID] = React.useState<number>(0);
  const [isTutor, setIsTutor] = React.useState<boolean>(false);
  const [loadingInbox, setLoadingInbox] = React.useState<boolean>(true);

  useEffect(() => {
      setUserID(5);
      if (!userID) return;
      async function load() {
        setLoadingInbox(true);
        try {
          const query = new URLSearchParams({
            tutor: isTutor === true ? "true" : "false",
            status: "pending",
          });


          const res = await fetch(`/profile-inbox/${userID}/preview?${query.toString()}`);


          if (!res.ok) {
            const text = await res.text();
            console.error("HTTP error", res.status, text.slice(0, 300));
            throw new Error(`HTTP ${res.status}`);
          }


          const data = (await res.json()) as MailFullMessages[];
          console.log("Data", data);
          setMessages(data);
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
        minHeight: "100vh",
        width: "100vw",
        bgcolor: BG,
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 4 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          maxWidth: 880,
          mx: "auto",
          width: "100%",
        }}
      >
        {/* Header pill */}
        <Box
          sx={{
            display: "inline-block",
            bgcolor: HEADER_PILL,
            color: TEXT_DARK,
            fontWeight: 800,
            fontSize: 24,
            px: 2.25,
            py: 0.75,
            borderRadius: 1.5,
            mb: 3,
          }}
        >
          Tutor Profile
        </Box>

        {/* Top card: avatar + name/email + Edit button */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: "transparent",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ flexWrap: "wrap", rowGap: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "#D9D9D9",
                }}
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}
                >
                  {name}
                </Typography>
                <Typography sx={{ color: TEXT_DARK, opacity: 0.85 }}>
                  {email}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              sx={{
                bgcolor: HEADER_PILL,
                color: TEXT_DARK,
                fontWeight: 700,
                textTransform: "none",
                ":hover": { bgcolor: "#AEB7E3" },
              }}
              onClick={() => console.log("Edit Tutor Profile clicked")}
            >
              Edit Profile
            </Button>
          </Stack>
        </Paper>

        {/* Subjects + Meeting Mode */}
        <Box sx={{ mt: 3 }}>
          <Section title="">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />
              }
            >
              {/* Subjects */}
              <Box sx={{ flex: 1, minWidth: 260 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1 }}
                >
                  Subjects
                </Typography>

                <Stack spacing={1.25}>
                  {subjects.map((subject) => (
                    <Pill key={subject} label={subject} />
                  ))}
                </Stack>
              </Box>

              {/* Meeting mode */}
              <Box sx={{ flex: 1, minWidth: 260 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1 }}
                >
                  Preferred meeting mode
                </Typography>
                <Typography sx={{ color: TEXT_DARK, fontSize: 18 }}>
                  {meetingMode}
                </Typography>
              </Box>
            </Stack>
          </Section>
        </Box>

        {/* Pending Requests */}
        <Box sx={{ mt: 3 }}>
          <Section title="Pending Requests">
            {pendingRequests.length > 0 ? (
              <Stack spacing={1.25}>
                {pendingRequests.map((req, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                  >
                    <Typography
                      sx={{
                        color: TEXT_DARK,
                        fontWeight: 600,
                        fontSize: 16,
                        minWidth: 160,
                      }}
                    >
                      {req.student}
                    </Typography>
                    <Pill label={req.subject} />
                    {req.status && <StatusChip status={req.status} />}
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: "rgba(60,55,68,0.6)" }}>
                No pending requests
              </Typography>
            )}
          </Section>
        </Box>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Section title="Inbox">

            {/* 1. Show loading state */}
            {loadingInbox && (
              <Box
                sx={{
                  height: 140,
                  borderRadius: 1,
                  border: "1px dashed rgba(60,55,68,0.2)",
                  bgcolor: "rgba(255,255,255,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(60,55,68,0.6)",
                  fontWeight: 500,
                }}
              >
                Loading messages...
              </Box>
            )}

            {/* 2. If no messages */}
            {!loadingInbox && messages.length === 0 && (
              <Box
                sx={{
                  height: 140,
                  borderRadius: 1,
                  border: "1px dashed rgba(60,55,68,0.2)",
                  bgcolor: "rgba(255,255,255,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(60,55,68,0.6)",
                  fontWeight: 500,
                }}
              >
                No new messages
              </Box>
            )}

            {/* 3. If messages exist → show them in styled rows */}
            {!loadingInbox && messages.length > 0 && (
              <Box
                sx={{
                  borderRadius: 1,
                  border: "1px solid rgba(60,55,68,0.2)",
                  bgcolor: "rgba(255,255,255,0.35)",
                  padding: 2,
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 2,
                      borderBottom: "1px solid rgba(60,55,68,0.2)",
                    }}
                  >
                    <strong>
                      {msg.senderFirstName} {msg.senderLastName}
                    </strong>

                    <div style={{ fontWeight: 600 }}>
                      {msg.subject}
                    </div>

                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      {msg.snippet}
                    </div>

                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Meeting Time: {msg.requestedStart ? new Date(msg.requestedStart).toLocaleString(): "No requested time"} - {msg.requestedEnd ? new Date(msg.requestedEnd).toLocaleString(): "No requested time"}
                    </div>

                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Status: {msg.status ? msg.status : "None"}
                    </div>

                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Meeting Mode: {msg.meetingMode?.replace(/_/g, " ")}
                    </div>
                  </Box>
                ))}
              </Box>
            )}

          </Section>
        </Box>
      </Box>
    </Box>
  );
};

export default TutorProfile;
