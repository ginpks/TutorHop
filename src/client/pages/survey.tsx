import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import IconLabelTextField from "../components/IconLabelTextField";
import PillPicker from "../components/pill-picker";
import { useState } from "react";

function Survey() {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const padding = 10;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100dvw"
      height="100dvh"
      bgcolor="#FBFFF1"
      pt="30px"
      sx={{ boxSizing: "border-box" }}
    >
      <Typography color="#3C3744" variant="h4" fontWeight="bold">
        What subject do you need help with?
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        pt="50px"
        pb="30px"
      >
        <Card>
          <CardContent>
            <PillPicker
              label="Select all the subjects you want help with"
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

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <IconLabelTextField />
          <Box display="flex" gap={2}>
            <SecondaryButton text="Back" px={padding} />
            <PrimaryButton text="Next" px={padding} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Survey;
