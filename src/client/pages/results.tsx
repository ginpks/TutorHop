import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Divider,
  Stack,
} from "@mui/material";

interface TutorDisplay {
  id: number;
  name: string;
  subject: string;
  rating: number;
}

const sampleTutors: TutorDisplay[] = [
  { id: 1, name: "Marco T.", subject: "Math", rating: 4.9 },
  { id: 2, name: "Franco H.", subject: "Physics", rating: 4.7 },
  { id: 3, name: "Kanika K.", subject: "Computer Science", rating: 5.0 },
  { id: 4, name: "David M.", subject: "Chemistry", rating: 4.5 },
  { id: 5, name: "Fabian D.M.", subject: "Biology", rating: 4.92 },
  { id: 6, name: "Gin P.", subject: "Psychology", rating: 4.85 },
  { id: 7, name: "Jess B.", subject: "Chemistry", rating: 1.4 },
];

const Results: React.FC = () => {
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");

  const handleSortChange = (event: SelectChangeEvent<"rating" | "name">) => {
    setSortBy(event.target.value as "rating" | "name");
  };

  const sortedTutors = [...sampleTutors].sort((a, b) =>
    sortBy === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name),
  );

  return (
    <Box
      sx={{
        display: "block",
        width: "99dvw",
        minHeight: "100dvh",
        py: 6,
        backgroundColor: "#FBFFF1",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
        {/* Heading */}
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

        {/* Sorting dropdown */}
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
            <MenuItem value="rating">Highest Rating</MenuItem>
            <MenuItem value="name">Name (A–Z)</MenuItem>
          </Select>
        </FormControl>

        {/* List of tutors */}
        <Stack spacing={2}>
          {sortedTutors.map((tutor, index) => (
            <Paper
              key={tutor.id}
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                py: 2,
                width: "100%",
                backgroundColor: index % 2 === 0 ? "#B4C5E4" : "#E0E7F8",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#3D52D5",
                  color: "#FBFFF1",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#090C9B", fontWeight: 600 }}
                >
                  {tutor.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "#3C3744" }}>
                  Subject: {tutor.subject}
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000" }}>
                  Rating: ⭐ {tutor.rating}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#3D52D5",
                  color: "#FBFFF1",
                  "&:hover": { backgroundColor: "#090C9B" },
                }}
              >
                Request Session
              </Button>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Results;
