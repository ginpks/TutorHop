import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Divider,
  Grid,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import DefaultBanner from "../components/main_banner/banner";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import { useNavigate } from "react-router-dom";
import { roleLabels, UserRole } from "../../shared/Enums/UserEnums";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface TutorDisplay {
  id: number;
  name: string;
  subject?: string;
  subjects?: Array<{ id: number; code: string; name: string }>;
  online: boolean;
  location: string;
}

const sampleTutors: TutorDisplay[] = [
  { id: 1, name: "Marco T.", subject: "Math", online: true, location: "Zoom" },
  {
    id: 2,
    name: "Franco H.",
    subject: "Physics",
    online: false,
    location: "Morrill",
  },
  {
    id: 3,
    name: "Kanika K.",
    subject: "Computer Science",
    online: true,
    location: "ISB",
  },
  {
    id: 4,
    name: "David M.",
    subject: "Chemistry",
    online: true,
    location: "Herter Hall",
  },
  {
    id: 5,
    name: "Fabian D.M.",
    subject: "Biology",
    online: true,
    location: "Worcester",
  },
  {
    id: 6,
    name: "Gin P.",
    subject: "Psychology",
    online: true,
    location: "Campus Center",
  },
  {
    id: 7,
    name: "Jess B.",
    subject: "Chemistry",
    online: true,
    location: "Goessmann",
  },
];

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"location" | "name">("location");

  const [firstName, setFirstName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [tutors, setTutors] = useState<TutorDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Request dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedTutor, setSelectedTutor] = useState<TutorDisplay | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | "">("");
  const [selectedMode, setSelectedMode] = useState<"in_person" | "zoom">(
    "zoom",
  );
  const [requestedStart, setRequestedStart] = useState<Dayjs | null>(
    dayjs().add(1, "day"),
  );
  const [requestedEnd, setRequestedEnd] = useState<Dayjs | null>(
    dayjs().add(1, "day").add(1, "hour"),
  );
  const [topic, setTopic] = useState<string>("");
  const [requestError, setRequestError] = useState<string>("");
  const [requestSuccess, setRequestSuccess] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserName(payload.email || "User");
          setUserRole(payload.role || "student");
          setUserId(payload.userId || 0);

          const userRes = await fetch(`/accounts/data?token=${token}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setFirstName(userData.user?.firstName || "");
          }
        } catch (err) {
          console.error("Fetch error: ", err);
        }
      }

      // Fetch tutors based on survey data
      try {
        const surveyDataStr = localStorage.getItem("surveyData");
        if (surveyDataStr) {
          const surveyData = JSON.parse(surveyDataStr);

          // Build query parameters
          const params = new URLSearchParams();
          if (surveyData.subjects && surveyData.subjects.length > 0) {
            params.append("subjects", surveyData.subjects.join(","));
          }
          if (surveyData.meetingMode) {
            // Convert "Remote / Zoom" to "zoom", "In-person" to "in_person"
            let mode = surveyData.meetingMode.toLowerCase();
            if (mode.includes("zoom") || mode.includes("remote")) {
              mode = "zoom";
            } else if (mode.includes("person")) {
              mode = "in_person";
            }
            params.append("meetingMode", mode);
          }
          if (surveyData.times && surveyData.times.length > 0) {
            params.append("times", JSON.stringify(surveyData.times));
          }

          const tutorRes = await fetch(`/tutors/search?${params.toString()}`);
          if (tutorRes.ok) {
            const tutorData = await tutorRes.json();
            // If no results, fall back to sample tutors
            if (tutorData.length === 0) {
              setTutors(sampleTutors);
            } else {
              setTutors(tutorData);
            }
          }
        } else {
          // No survey data, use sample tutors
          setTutors(sampleTutors);
        }
      } catch (err) {
        console.error("Tutor fetch error: ", err);
        setTutors(sampleTutors); // Fallback to sample data
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSortChange = (event: SelectChangeEvent<"location" | "name">) => {
    setSortBy(event.target.value as "location" | "name");
  };

  const sortedTutors = [...tutors].sort((a, b) =>
    sortBy === "location"
      ? a.location.localeCompare(b.location)
      : a.name.localeCompare(b.name),
  );

  const handleProfileClick = () => {
    if (userRole === "tutor") {
      navigate("/tutorprofile");
    } else {
      navigate("/studentprofile");
    }
  };

  const handleOpenRequestDialog = (tutor: TutorDisplay) => {
    setSelectedTutor(tutor);
    setRequestError("");
    setRequestSuccess("");
    // Pre-select first subject if available
    if (tutor.subjects && tutor.subjects.length > 0) {
      setSelectedSubjectId(tutor.subjects[0].id);
    }
    // Set meeting mode based on tutor's availability
    if (tutor.online) {
      setSelectedMode("zoom");
    } else {
      setSelectedMode("in_person");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTutor(null);
    setSelectedSubjectId("");
    setTopic("");
    setRequestError("");
    setRequestSuccess("");
  };

  const handleSubmitRequest = async () => {
    if (
      !selectedTutor ||
      !selectedSubjectId ||
      !requestedStart ||
      !requestedEnd
    ) {
      setRequestError("Please fill in all required fields");
      return;
    }

    if (!userId) {
      setRequestError("You must be logged in to request an appointment");
      return;
    }

    try {
      const res = await fetch("/meeting-requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          tutorId: selectedTutor.id,
          subjectId: selectedSubjectId,
          requestedStart: requestedStart.toISOString(),
          requestedEnd: requestedEnd.toISOString(),
          mode: selectedMode,
          topic: topic || undefined,
        }),
      });

      if (res.ok) {
        setRequestSuccess("Appointment request sent successfully!");
        setTimeout(() => {
          handleCloseDialog();
        }, 2000);
      } else {
        const errorData = await res.json();
        setRequestError(
          errorData.error || "Failed to create appointment request",
        );
      }
    } catch (err) {
      console.error("Request error: ", err);
      setRequestError("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#FBFFF1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DefaultBanner
        title="Tutor Hop"
        profilePicUrl=""
        displayName={firstName || userName}
        isLoggedIn={isLoggedIn}
        onProfileClick={handleProfileClick}
        userType={roleLabels[userRole as UserRole] || "Student"}
      />
      <Box sx={{ flexGrow: 1, p: 4, boxSizing: "border-box" }}>
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            color: "#3C3744",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Tutor Results
        </Typography>
        <FormControl sx={{ mb: 4, minWidth: 200 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sortBy}
            label="Sort by"
            onChange={handleSortChange}
            sx={{ backgroundColor: "#ffffff", color: "#000000" }}
          >
            <MenuItem value="location">Location</MenuItem>
            <MenuItem value="name">Name (A–Z)</MenuItem>
          </Select>
        </FormControl>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="#3C3744">
              Loading tutors...
            </Typography>
          </Box>
        ) : sortedTutors.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="#3C3744">
              No tutors found matching your criteria. Try adjusting your search.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} columns={1}>
            {sortedTutors.map((card) => (
              <Grid component={"div"} key={card.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {card.name}
                    </Typography>
                    {card.subjects && card.subjects.length > 0 ? (
                      <Typography variant="body2">
                        {card.subjects.map((s) => s.code).join(", ")}
                      </Typography>
                    ) : (
                      <Typography variant="body2">{card.subject}</Typography>
                    )}
                    {card.online ? (
                      <Typography variant="body2" color="success">
                        Virtual Available
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error">
                        In-person Only
                      </Typography>
                    )}
                    <Typography variant="body2">{card.location}</Typography>
                  </CardContent>
                  <CardActions>
                    <PrimaryButton
                      text="Request Appointment"
                      onClick={() => handleOpenRequestDialog(card)}
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Request Appointment Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Request Appointment with {selectedTutor?.name}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              {requestError && <Alert severity="error">{requestError}</Alert>}
              {requestSuccess && (
                <Alert severity="success">{requestSuccess}</Alert>
              )}

              {/* Subject Selection */}
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={selectedSubjectId}
                  label="Subject"
                  onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                >
                  {selectedTutor?.subjects &&
                  selectedTutor.subjects.length > 0 ? (
                    selectedTutor.subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No subjects available</MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Meeting Mode Selection */}
              <FormControl fullWidth>
                <InputLabel>Meeting Mode</InputLabel>
                <Select
                  value={selectedMode}
                  label="Meeting Mode"
                  onChange={(e) =>
                    setSelectedMode(e.target.value as "in_person" | "zoom")
                  }
                >
                  <MenuItem value="zoom">Virtual / Zoom</MenuItem>
                  <MenuItem value="in_person">In-Person</MenuItem>
                </Select>
              </FormControl>

              {/* Start Time */}
              <DateTimePicker
                label="Start Time"
                value={requestedStart}
                onChange={(newValue) => setRequestedStart(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />

              {/* End Time */}
              <DateTimePicker
                label="End Time"
                value={requestedEnd}
                onChange={(newValue) => setRequestedEnd(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />

              {/* Topic */}
              <TextField
                label="Topic (Optional)"
                multiline
                rows={3}
                fullWidth
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What would you like help with?"
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <SecondaryButton text="Cancel" onClick={handleCloseDialog} />
          <PrimaryButton
            text="Send Request"
            onClick={handleSubmitRequest}
            disabled={!selectedSubjectId || !requestedStart || !requestedEnd}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Results;
