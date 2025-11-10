import { Box, Card, CardContent, Typography } from "@mui/material";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import IconLabelTextField from "../components/IconLabelTextField";
import PillPicker from "../components/pill-picker";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

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

  // temp data
  const classes = ["CICS 109", "CICS 110", "CICS 127", "CICS 160", "CICS 210"];

  const padding = 10;
  const width = 400;

  const [page, setPage] = useState(0);

  const [answers, setAnswers] = useState<QuestionSubmission[]>(() =>
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
    <Box
      display="flex"
      flexDirection="column"
      width="100dvw"
      height="100dvh"
      bgcolor="#FBFFF1"
      sx={{ boxSizing: "border-box", px: 2 }}
    >
      <Box mt={3} textAlign="center">
        <Typography color="#3C3744" variant="h4" fontWeight="bold">
          {questions[page]}
        </Typography>
      </Box>

      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card sx={{ width, maxWidth: "90vw" }}>
          <CardContent>
            <PillPicker
              options={classes}
              value={current.primary}
              onChange={handlePrimaryChange}
              placeholder="e.g., Math, History…"
            />
          </CardContent>
        </Card>
      </Box>

      <Box
        mb={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Box sx={{ width, maxWidth: "90vw" }}>
          <IconLabelTextField
            sx={{ width: "100%" }}
            value={current.secondary}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSecondaryChange(e.target.value)
            }
          />
        </Box>

        <Box display="flex" gap={2} sx={{ width, maxWidth: "90vw" }}>
          <SecondaryButton onClick={onBack} text="Back" px={padding} />
          <PrimaryButton
            onClick={onNext}
            text="Next"
            px={padding}
            disabled={current.primary.length === 0}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Survey;
