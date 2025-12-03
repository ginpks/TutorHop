import { Box, Typography, Stack, Button, Switch } from "@mui/material";
import PillPicker from "../components/pill-picker";
import SecondaryButton from "../components/secondary-button";
import PrimaryButton from "../components/primary-button";
import IconLabelTextField from "../components/IconLabelTextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { Dayjs } from "dayjs";
import DefaultBanner from "../components/main_banner/banner";

interface QuestionSubmission {
  primary: string[];
  secondary: string;
}

export default function Survey() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  const classes = ["CICS 109", "CICS 110", "CICS 127", "CICS 160", "CICS 210"];
  const questions = [
    "What subjects do you need help with?",
    "When do you want to study?",
    "Where do you want to study?",
  ];
  const locations = ["Remote / Zoom", "In-person"];
  const [mode, setMode] = useState<boolean>(true);

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
    <PillPicker
      options={classes}
      value={current.primary}
      onChange={onPrimaryChange}
      placeholder="Select classes or subjects..."
    />,

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
      placeholder="Select locations..."
    />,
  ];

  const onBack = () => {
    if (page - 1 < 0) navigate("/Landing");
    else setPage(page - 1);
  };

  const onNext = () => {
    if (page + 1 >= questions.length) navigate("/results");
    else setPage(page + 1);
  };

  return (
    <Box display="flex" flexDirection="column" height="100dvh">
      <DefaultBanner title="Tutor Hop" isLoggedIn={false} />
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
