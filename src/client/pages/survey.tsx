import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import IconLabelTextField from "../components/IconLabelTextField";
import PillPicker from "../components/pill-picker";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

interface QuestionSubmission {
  primary: string[];
  secondary: string;
}

function Survey() {
  const navigate = useNavigate();

  const questions = [
    "What subjects do you need help with?",
    "When do you want to study?",
    "Where do you want to study?",
  ];

  const classes = ["CICS 109", "CICS 110", "CICS 127", "CICS 160", "CICS 210"];

  const [page, setPage] = useState(0);

  const [answers, setAnswers] = useState<QuestionSubmission[]>(
    Array.from({ length: questions.length }, () => ({
      primary: [],
      secondary: "",
    })),
  );

  const current = answers[page];

  const handlePrimaryChange = (value: string[]) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[page] = { ...updated[page], primary: value };
      return updated;
    });
  };

  const handleSecondaryChange = (value: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[page] = { ...updated[page], secondary: value };
      return updated;
    });
  };

  const onNext = () => {
    if (page + 1 >= questions.length) navigate("/results");
    else setPage(page + 1);
  };

  const onBack = () => {
    if (page - 1 < 0) navigate("/");
    else setPage(page - 1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100dvh"
        bgcolor="#FBFFF1"
        sx={{
          boxSizing: "border-box",
          px: 3,
          py: 4,
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            color="#3C3744"
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            {questions[page]}
          </Typography>
        </Box>

        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 4,
              boxShadow: 3,
              bgcolor: "#fff",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {page === 1 ? (
                <DatePicker
                  label="Pick a date"
                  sx={{ width: "100%" }}
                  onChange={(date: Dayjs | null) => {
                    const dateString = date ? date.format("YYYY-MM-DD") : "";
                    handlePrimaryChange(dateString ? [dateString] : []);
                  }}
                  value={
                    current.primary.length > 0
                      ? dayjs(current.primary[0])
                      : null
                  }
                />
              ) : (
                <PillPicker
                  options={classes}
                  value={current.primary}
                  onChange={handlePrimaryChange}
                  placeholder="e.g., Math, History…"
                />
              )}
            </CardContent>
          </Card>
        </Box>

        <Box
          mt={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Box sx={{ width: "100%", maxWidth: 480 }}>
            <IconLabelTextField
              sx={{ width: "100%" }}
              value={current.secondary}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSecondaryChange(e.target.value)
              }
            />
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{ width: "100%", maxWidth: 480 }}
          >
            <SecondaryButton onClick={onBack} text="Back" px={8} />
            <PrimaryButton
              onClick={onNext}
              text={page + 1 === questions.length ? "Submit" : "Next"}
              px={8}
              disabled={current.primary.length === 0}
            />
          </Stack>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default Survey;
