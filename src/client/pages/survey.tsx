import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import IconLabelTextField from "../components/IconLabelTextField";

function Survey() {
  const padding = 10;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100dvw"
      height="100dvh"
      bgcolor="#FBFFF1"
      pt="20px"
      sx={{ boxSizing: "border-box" }}
    >
      <Typography color="#3C3744" variant="h4" fontWeight="bold">
        This is a question placeholder?
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        pt="50px"
        pb="20px"
      >
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Placeholder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Card
            </Typography>
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
