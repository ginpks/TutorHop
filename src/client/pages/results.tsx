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
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  OutlinedInput,
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
  subjects?: Array<{ id: number; code: string; name: string }>;
  online: boolean;
  location: string;
  meetingPreference?: "in_person" | "zoom" | "either";
}

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

  // Filter state
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedMeetingMode, setSelectedMeetingMode] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

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
  const [duration, setDuration] = useState<number>(60); // Duration in minutes
  const [topic, setTopic] = useState<string>("");
  const [requestError, setRequestError] = useState<string>("");
  const [requestSuccess, setRequestSuccess] = useState<string>("");

  // Function to fetch tutors based on current filters
  const fetchTutors = async (subjects?: string[], meetingMode?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const subjectsToUse = subjects || selectedSubjects;
      const modeToUse =
        meetingMode !== undefined ? meetingMode : selectedMeetingMode;

      if (subjectsToUse.length > 0) {
        params.append("subjects", subjectsToUse.join(","));
      }
      if (modeToUse) {
        params.append("meetingMode", modeToUse);
      }

      const queryUrl = `/tutors/search?${params.toString()}`;
      console.log("Fetching tutors from:", queryUrl);

      const tutorRes = await fetch(queryUrl);
      if (tutorRes.ok) {
        const tutorData = await tutorRes.json();
        console.log("Received tutor data:", tutorData);
        if (tutorData.length === 0) {
          console.log("No tutors found, using sample data");
          setTutors(sampleTutors);
        } else {
          setTutors(tutorData);
        }
      } else {
        console.error(
          "Failed to fetch tutors:",
          tutorRes.status,
          tutorRes.statusText,
        );
        setTutors(sampleTutors);
      }
    } catch (err) {
      console.error("Tutor fetch error: ", err);
      setTutors(sampleTutors);
    }
    setLoading(false);
  };

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

      // Load available subjects
      try {
        const subjectsRes = await fetch("/subjects/list");
        if (subjectsRes.ok) {
          const subjectsData = await subjectsRes.json();
          const subjectCodes = subjectsData.map((s: any) => s.code);
          setAvailableSubjects(subjectCodes);
        }
      } catch (err) {
        console.error("Subject fetch error: ", err);
      }

      // Load survey data and set initial filters
      try {
        const surveyDataStr = localStorage.getItem("surveyData");
        if (surveyDataStr) {
          const surveyData = JSON.parse(surveyDataStr);
          console.log("Survey data from localStorage:", surveyData);

          const subjects = surveyData.subjects || [];
          const meetingMode = surveyData.meetingMode || "";

          const queryUrl = `/tutors/search?${params.toString()}`;
          console.log("Fetching tutors from:", queryUrl);

          const tutorRes = await fetch(queryUrl);
          if (tutorRes.ok) {
            const tutorData = await tutorRes.json();
            console.log("Received tutor data:", tutorData);
            setTutors(tutorData);
          } else {
            console.error("Failed to fetch tutors:", tutorRes.status, tutorRes.statusText);
            setTutors([]);
          }
        } else {
          // No survey data, show empty results
          console.log("No survey data found");
          setTutors([]);
        }
      } catch (err) {
        console.error("Tutor fetch error: ", err);
        setTutors([]);
      }
    };

    fetchData();
  }, []);

  const handleSortChange = (event: SelectChangeEvent<"location" | "name">) => {
    setSortBy(event.target.value as "location" | "name");
  };

  const handleSubjectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const subjects = typeof value === "string" ? value.split(",") : value;
    setSelectedSubjects(subjects);
  };

  const handleMeetingModeChange = (event: SelectChangeEvent<string>) => {
    setSelectedMeetingMode(event.target.value);
  };

  const handleApplyFilters = () => {
    // Update localStorage with new filter values
    const surveyDataStr = localStorage.getItem("surveyData");
    const surveyData = surveyDataStr ? JSON.parse(surveyDataStr) : {};
    surveyData.subjects = selectedSubjects;
    surveyData.meetingMode = selectedMeetingMode;
    localStorage.setItem("surveyData", JSON.stringify(surveyData));

    // Fetch new results
    fetchTutors();
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
    console.log("Opening request dialog for tutor:", tutor);
    setSelectedTutor(tutor);
    setRequestError("");
    setRequestSuccess("");
    // Pre-select first subject if available
    if (tutor.subjects && tutor.subjects.length > 0) {
      setSelectedSubjectId(tutor.subjects[0].id);
    } else {
      // Reset subject if no subjects available
      setSelectedSubjectId("");
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
    if (!selectedTutor || !selectedSubjectId || !requestedStart) {
      setRequestError("Please fill in all required fields");
      return;
    }

    if (!userId) {
      setRequestError("You must be logged in to request an appointment");
      return;
    }

    // Calculate end time based on start time and duration
    const requestedEnd = requestedStart.add(duration, "minute");

    try {
      console.log("Submitting appointment request:", {
        studentId: userId,
        tutorId: selectedTutor.id,
        subjectId: selectedSubjectId,
        requestedStart: requestedStart.toISOString(),
        requestedEnd: requestedEnd.toISOString(),
        mode: selectedMode,
        topic: topic || undefined,
        duration: duration,
      });

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
        const data = await res.json();
        console.log("Request created successfully:", data);
        setRequestSuccess("Appointment request sent successfully!");
        setTimeout(() => {
          handleCloseDialog();
        }, 2000);
      } else {
        const errorData = await res.json();
        console.error("Request failed:", errorData);
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

        {/* Filter Panel */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            bgcolor: "#FFFFFF",
            borderRadius: 3,
            border: "1px solid #E8E8E8",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#3C3744",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box component="span" sx={{ fontSize: "1.5rem" }}>
                🔍
              </Box>
              Filter Results
            </Typography>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                borderColor: "#B4C5E4",
                color: "#B4C5E4",
                "&:hover": {
                  borderColor: "#9AB0D9",
                  bgcolor: "#F0F4FA",
                },
              }}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>

          {showFilters && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mt: 4,
                pt: 3,
                borderTop: "2px solid #F0F0F0",
              }}
            >
              {/* Subjects Filter */}
              <FormControl fullWidth>
                <InputLabel id="subjects-label" sx={{ fontWeight: 500 }}>
                  Subjects
                </InputLabel>
                <Select
                  labelId="subjects-label"
                  id="subjects-select"
                  multiple
                  value={selectedSubjects}
                  onChange={handleSubjectChange}
                  input={<OutlinedInput label="Subjects" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{
                            bgcolor: "#B4C5E4",
                            color: "#FFFFFF",
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: "#9AB0D9",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E0E0E0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#B4C5E4",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#B4C5E4",
                    },
                  }}
                >
                  {availableSubjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Meeting Mode Filter */}
              <FormControl fullWidth>
                <InputLabel id="meeting-mode-label" sx={{ fontWeight: 500 }}>
                  Meeting Mode
                </InputLabel>
                <Select
                  labelId="meeting-mode-label"
                  id="meeting-mode-select"
                  value={selectedMeetingMode}
                  label="Meeting Mode"
                  onChange={handleMeetingModeChange}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E0E0E0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#B4C5E4",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#B4C5E4",
                    },
                  }}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="zoom">Virtual / Zoom</MenuItem>
                  <MenuItem value="in_person">In-Person</MenuItem>
                  <MenuItem value="either">Either</MenuItem>
                </Select>
              </FormControl>

              {/* Apply Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <PrimaryButton
                  text="Apply Filters"
                  onClick={handleApplyFilters}
                />
              </Box>
            </Box>
          )}
        </Paper>

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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 2.5,
              maxWidth: "1200px",
            }}
          >
            {sortedTutors.map((card) => (
              <Card
                key={card.id}
                elevation={2}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #E8E8E8",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    borderColor: "#B4C5E4",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: "#3C3744",
                      mb: 1,
                      fontSize: "1.1rem",
                    }}
                  >
                    {card.name}
                  </Typography>

                  {card.meetingPreference === "either" ? (
                    <Chip
                      label="Hybrid"
                      size="small"
                      sx={{
                        bgcolor: "#E3F2FD",
                        color: "#1976D2",
                        fontWeight: 600,
                        border: "1px solid #90CAF9",
                        height: "22px",
                        fontSize: "0.7rem",
                        width: "fit-content",
                        mb: 1.5,
                      }}
                    />
                  ) : card.online || card.meetingPreference === "zoom" ? (
                    <Chip
                      label="Virtual"
                      size="small"
                      sx={{
                        bgcolor: "#E8F5E9",
                        color: "#2E7D32",
                        fontWeight: 600,
                        border: "1px solid #A5D6A7",
                        height: "22px",
                        fontSize: "0.7rem",
                        width: "fit-content",
                        mb: 1.5,
                      }}
                    />
                  ) : (
                    <Chip
                      label="In-person"
                      size="small"
                      sx={{
                        bgcolor: "#FFF3E0",
                        color: "#E65100",
                        fontWeight: 600,
                        border: "1px solid #FFCC80",
                        height: "22px",
                        fontSize: "0.7rem",
                        width: "fit-content",
                        mb: 1.5,
                      }}
                    />
                  )}

                  {card.subjects && card.subjects.length > 0 && (
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {card.subjects.map((s) => (
                          <Chip
                            key={s.id}
                            label={s.code}
                            size="small"
                            sx={{
                              bgcolor: "#F5F5F5",
                              color: "#3C3744",
                              fontWeight: 600,
                              border: "1px solid #E0E0E0",
                              height: "22px",
                              fontSize: "0.7rem",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>

                <Divider />

                <CardActions
                  sx={{ p: 1.5, bgcolor: "#FAFAFA", justifyContent: "center" }}
                >
                  {isLoggedIn && userRole === "student" ? (
                    <Button
                      onClick={() => handleOpenRequestDialog(card)}
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#B4C5E4",
                        color: "#FFFFFF",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        px: 2,
                        py: 0.75,
                        borderRadius: 1.5,
                        "&:hover": {
                          bgcolor: "#9AB0D9",
                        },
                      }}
                    >
                      Request
                    </Button>
                  ) : !isLoggedIn ? (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#757575",
                        fontStyle: "italic",
                        fontSize: "0.75rem",
                      }}
                    >
                      Log in to request
                    </Typography>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#757575",
                        fontStyle: "italic",
                        fontSize: "0.75rem",
                      }}
                    >
                      Students only
                    </Typography>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>
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

              {/* Meeting Mode Selection - only show available options */}
              <FormControl fullWidth>
                <InputLabel>Meeting Mode</InputLabel>
                <Select
                  value={selectedMode}
                  label="Meeting Mode"
                  onChange={(e) =>
                    setSelectedMode(e.target.value as "in_person" | "zoom")
                  }
                >
                  {selectedTutor?.online && (
                    <MenuItem value="zoom">Virtual / Zoom</MenuItem>
                  )}
                  {(!selectedTutor?.online ||
                    selectedTutor?.meetingPreference === "either" ||
                    selectedTutor?.meetingPreference === "in_person") && (
                    <MenuItem value="in_person">In-Person</MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Start Time */}
              <DateTimePicker
                label="Start Time"
                value={requestedStart}
                onChange={(newValue) => setRequestedStart(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />

              {/* Duration Selection */}
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={duration}
                  label="Duration"
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                  <MenuItem value={90}>1.5 hours</MenuItem>
                  <MenuItem value={120}>2 hours</MenuItem>
                </Select>
              </FormControl>

              {/* Display calculated end time */}
              {requestedStart && (
                <Typography variant="body2" color="text.secondary">
                  End time:{" "}
                  {requestedStart
                    .add(duration, "minute")
                    .format("MMM D, YYYY h:mm A")}
                </Typography>
              )}

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
            disabled={!selectedSubjectId || !requestedStart}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Results;
