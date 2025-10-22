import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import IconLabelTextField from "../components/IconLabelTextField";
import PillPicker from "../components/pill-picker";
import { useState } from "react";

function Survey() {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const padding = 10;
  const width = 400;
  // this sizing sucks

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
          What subject do you need help with?
        </Typography>
      </Box>

      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card sx={{ width: width, maxWidth: "90vw" }}>
          <CardContent>
            <PillPicker
              options={[
                "Class1",
                "Class2",
                "Class3",
                "Class4",
                "Class5",
                "Class6",
                "Class7",
                "Class8",
                "Class9",
                "Class10",
              ]}
              value={selectedClasses}
              onChange={setSelectedClasses}
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
        <Box sx={{ width: width, maxWidth: "90vw" }}>
          <IconLabelTextField sx={{ width: "100%" }} />
        </Box>

        <Box display="flex" gap={2} sx={{ width: 400, maxWidth: "90vw" }}>
          <SecondaryButton text="Back" px={padding} />
          <PrimaryButton text="Next" px={padding} />
        </Box>
      </Box>
    </Box>
  );
}

export default Survey;
