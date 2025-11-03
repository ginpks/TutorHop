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

type Subject = { code: string; status: "Open" | "Closed" };

interface StudentProfileProps {
  name?: string;
  email?: string;
  subjects?: Subject[];
  meetingMode?: string;
}

const BG = "#FBFFF1";            // page background (pale yellow)
const HEADER_PILL = "#B9C1E9";   // “Student Profile” pill
const SECTION_BG = "#E9F4F4";    
const TEXT_DARK = "#3C3744";

const Pill = ({ label }: { label: string }) => (
  <Box
    component="span"
    sx={{
      px: 1.25,
      py: 0.5,
      borderRadius: 999,
      bgcolor: "#E5E7EB", // gray-200
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

const StatusChip = ({ status }: { status: "Open" | "Closed" }) => (
  <Chip
    label={status}
    size="small"
    sx={{
      borderRadius: 999,
      fontWeight: 600,
      bgcolor: status === "Open" ? "#E0F2E9" : "#FBEAEA",
      color: status === "Open" ? "#2E7D32" : "#B00020",
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
    <Typography
      variant="h6"
      sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1 }}
    >
      {title}
    </Typography>
    {children}
  </Paper>
);

const StudentProfile: React.FC<StudentProfileProps> = ({
  name = "John doe",
  email = "johndoe@umass.edu",
  subjects = [
    { code: "CS 240", status: "Open" },
    { code: "CS 311", status: "Open" },
  ],
  meetingMode = "In-person",
}) => {
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
          Student Profile
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
              onClick={() => {
                // hook up edit action / navigation here
                console.log("Edit Profile clicked");
              }}
            >
              Edit Profile
            </Button>
          </Stack>
        </Paper>

        {/* Subjects + Preferred meeting mode */}
        <Box sx={{ mt: 3 }}>
          <Section title="">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              divider={
                <Divider
                  orientation={/column/.test(
                    ({} as any) // placeholder—Divider is controlled only by direction above
                  ) ? "horizontal" : "vertical"}
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
                  {subjects.map((s) => (
                    <Stack
                      key={s.code}
                      direction="row"
                      alignItems="center"
                      spacing={1.25}
                    >
                      <Pill label={s.code} />
                      <StatusChip status={s.status} />
                    </Stack>
                  ))}
                </Stack>
              </Box>

              {/* Preferred meeting mode */}
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

        {/* Saved surveys */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Section title="Saved surveys">
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
              No saved surveys yet
            </Box>
          </Section>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentProfile;
