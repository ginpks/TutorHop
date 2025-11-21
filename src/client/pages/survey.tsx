import { Box, Typography, Stack } from "@mui/material";
import PillPicker from "../components/pill-picker";
import SecondaryButton from "../components/secondary-button";
import PrimaryButton from "../components/primary-button";
import IconLabelTextField from "../components/IconLabelTextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Survey() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const classes = ["CICS 109", "CICS 110", "CICS 127", "CICS 160", "CICS 210"];
  const questions = [
    "What subjects do you need help with?",
    "When do you want to study?",
    "Where do you want to study?",
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
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      width="100vw"
      bgcolor="#FBFFF1"
      sx={{ boxSizing: "border-box", p: 4 }}
    >
      {/* --- TOP: Question --- */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#3C3744">
          What subjects do you need help with?
        </Typography>
      </Box>

      {/* --- MIDDLE: Widget Area --- */}
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <PillPicker
          options={classes}
          value={[]}
          onChange={() => {}}
          placeholder="e.g., Math, History…"
        />
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
          <IconLabelTextField value={""} onChange={() => {}} />
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
            disabled={false}
          />
        </Stack>
      </Box>
    </Box>
  );
}
