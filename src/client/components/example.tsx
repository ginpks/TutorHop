import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface ExampleCardComponentProps {
  title: string;
  subtitle: string;
}

function ExampleCardComponent({ title, subtitle }: ExampleCardComponentProps) {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ minWidth: 320, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ExampleCardComponent;
