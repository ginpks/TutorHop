import { Box, Typography, Stack, Button, Switch } from "@mui/material";
import PillPicker from "../components/pill-picker";
import SecondaryButton from "../components/secondary-button";
import PrimaryButton from "../components/primary-button";
import IconLabelTextField from "../components/IconLabelTextField";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { Dayjs } from "dayjs";
import DefaultBanner from "../components/main_banner/banner";
import { roleLabels, UserRole } from "../../shared/Enums/UserEnums";

interface QuestionSubmission {
  primary: string[];
  secondary: string;
}

export default function Survey() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  const [firstName, setFirstName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [classes, setClasses] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);

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

          const userRes = await fetch(`/accounts/data?token=${token}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setFirstName(userData.user?.firstName || "");
          }
        } catch (err) {
          console.error("Fetch error: ", err);
        }
      }

      // Fetch subjects from API
      try {
        const subjectsRes = await fetch("/subjects/list");
        if (subjectsRes.ok) {
          const subjectsData = await subjectsRes.json();
          // Extract just the codes for the PillPicker
          const subjectCodes = subjectsData.map((s: any) => s.code);
          setClasses(subjectCodes);
          console.log(`Loaded ${subjectCodes.length} subjects from database`);
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (err) {
        console.error("Subject fetch error: ", err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchData();
  }, []);

  const questions = [
    "What subjects do you need help with?",
    "When do you want to study?",
    "How do you want to study?",
  ];
  const locations = ["Remote / Zoom", "In-person"];

  const [answers, setAnswers] = useState<QuestionSubmission[]>(
    Array.from({ length: questions.length }, () => ({
      primary: [],
      secondary: "",
    })),
  );

  const current = answers[page];

  const onPrimaryChange = (value: string[]) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[page] = { ...updated[page], primary: value };
      return updated;
    });
  };

  const onSecondaryChange = (value: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[page] = { ...updated[page], secondary: value };
      return updated;
    });
  };

  const onAddDateTime = () => {
    if (!selectedDate || !selectedTime) return;
    const combined = `${selectedDate.format("YYYY-MM-DD")} ${selectedTime.format("h:mm A")}`;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[page] = {
        ...updated[page],
        primary: [...updated[page].primary, combined],
      };
      return updated;
    });

    setSelectedDate(null);
    setSelectedTime(null);
  };

  const questionWidgets = [
    loadingSubjects ? (
      <Typography variant="h6" color="#3C3744">
        Loading subjects...
      </Typography>
    ) : (
      <PillPicker
        options={classes}
        value={current.primary}
        onChange={onPrimaryChange}
        placeholder="Select classes or subjects..."
      />
    ),

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        maxWidth="480px"
        maxHeight="200px"
        display="flex"
        flexDirection="column"
      >
        <Box maxWidth="480px" gap="5px" display="flex" flexDirection="row">
          <DatePicker
            label="Pick a day"
            value={selectedDate}
            onChange={(v) => setSelectedDate(v)}
          />
          <MobileTimePicker
            orientation="landscape"
            label="Pick a time"
            value={selectedTime}
            onChange={(v) => setSelectedTime(v)}
          />
          <PrimaryButton
            text="ADD"
            disabled={!selectedDate || !selectedTime}
            onClick={onAddDateTime}
          />
        </Box>

        <Box
          flex={1}
          overflow="auto"
          mt={1}
          sx={{
            scrollbarWidth: "thin",
            scrollbarColor: "#bbb transparent",

            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbb",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#999",
            },
          }}
        >
          {current.primary.map((entry, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <SecondaryButton
                fullWidth
                text={entry}
                onClick={() => {
                  setAnswers((prev) => {
                    const updated = [...prev];
                    updated[page] = {
                      ...updated[page],
                      primary: updated[page].primary.filter(
                        (_, i) => i !== index,
                      ),
                    };
                    return updated;
                  });
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </LocalizationProvider>,

    <PillPicker
      options={locations}
      value={current.primary}
      onChange={onPrimaryChange}
      placeholder="Select mode..."
    />,
  ];

  const onBack = () => {
    if (page - 1 < 0) navigate("/landing");
    else setPage(page - 1);
  };

  const onNext = () => {
    if (page + 1 >= questions.length) {
      // Convert meeting mode: if both selected, use "either"
      let meetingMode = "either";
      const selectedModes = answers[2].primary;

      if (selectedModes.length === 1) {
        // Only one mode selected, convert it to proper format
        const mode = selectedModes[0].toLowerCase();
        if (mode.includes("zoom") || mode.includes("remote")) {
          meetingMode = "zoom";
        } else if (mode.includes("person")) {
          meetingMode = "in_person";
        }
      } else if (selectedModes.length === 2) {
        // Both modes selected, use "either"
        meetingMode = "either";
      }

      // Store survey data and navigate to results with the data
      const surveyData = {
        subjects: answers[0].primary, // subjects from first question
        times: answers[1].primary, // times from second question
        meetingMode: meetingMode, // meeting mode from third question
      };

      // Store in localStorage for results page to access
      localStorage.setItem("surveyData", JSON.stringify(surveyData));

      navigate("/results");
    } else {
      setPage(page + 1);
    }
  };

  const handleProfileClick = () => {
    if (userRole === "tutor") {
      navigate("/tutorprofile");
    } else {
      navigate("/studentprofile");
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100dvh">
      <DefaultBanner
        title="Tutor Hop"
        profilePicUrl=""
        displayName={firstName || userName}
        isLoggedIn={isLoggedIn}
        onProfileClick={handleProfileClick}
        userType={roleLabels[userRole as UserRole] || "Student"}
      />
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        width="100vw"
        bgcolor="#FBFFF1"
        sx={{ boxSizing: "border-box", p: 4 }}
      >
        {/* --- TOP: Question --- */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" fontWeight="bold" color="#3C3744">
            {questions[page]}
          </Typography>
        </Box>

        {/* --- MIDDLE: Widget Area --- */}
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {questionWidgets[page]}
        </Box>

        {/* --- BOTTOM: Notes + Buttons --- */}
        <Box
          mt={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Box sx={{ width: "100%", maxWidth: 480 }}>
            <IconLabelTextField
              value={current.secondary}
              onChange={(e) => onSecondaryChange(e.target.value)}
            />
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", maxWidth: 480 }}
          >
            <SecondaryButton fullWidth onClick={onBack} text="Back" py={1.5} />
            <PrimaryButton
              fullWidth
              onClick={onNext}
              text={"Next"}
              py={1.5}
              disabled={current.primary.length == 0}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
