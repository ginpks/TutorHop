import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Divider,
  Grid,
  CardActions,
} from "@mui/material";
import DefaultBanner from "../components/main_banner/banner";
import PrimaryButton from "../components/primary-button";
import { useNavigate } from "react-router-dom";

interface TutorDisplay {
  id: number;
  name: string;
  subject: string;
  online: boolean;
  location: string;
}

const sampleTutors: TutorDisplay[] = [
  { id: 1, name: "Marco T.", subject: "Math", online: true, location: "Zoom" },
  {
    id: 2,
    name: "Franco H.",
    subject: "Physics",
    online: false,
    location: "Morrill",
  },
  {
    id: 3,
    name: "Kanika K.",
    subject: "Computer Science",
    online: true,
    location: "ISB",
  },
  {
    id: 4,
    name: "David M.",
    subject: "Chemistry",
    online: true,
    location: "Herter Hall",
  },
  {
    id: 5,
    name: "Fabian D.M.",
    subject: "Biology",
    online: true,
    location: "Worcester",
  },
  {
    id: 6,
    name: "Gin P.",
    subject: "Psychology",
    online: true,
    location: "Campus Center",
  },
  {
    id: 7,
    name: "Jess B.",
    subject: "Chemistry",
    online: true,
    location: "Goessmann",
  },
];

const Results: React.FC = () => {
  const [sortBy, setSortBy] = useState<"location" | "name">("location");

  const handleSortChange = (event: SelectChangeEvent<"location" | "name">) => {
    setSortBy(event.target.value as "location" | "name");
  };

  const sortedTutors = [...sampleTutors].sort((a, b) =>
    sortBy === "location"
      ? a.location.localeCompare(b.location)
      : a.name.localeCompare(b.name),
  );
  const requestApp = () => {
    useNavigate()("/landing");
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <DefaultBanner title="Tutor Hop" />
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
          <MenuItem value="location">Location</MenuItem>
          <MenuItem value="name">Name (A–Z)</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={2} columns={1}>
        {sortedTutors.map((card) => (
          <Grid component={"div"} key={card.id}>
            {
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {" "}
                    {card.name}{" "}
                  </Typography>
                  <Typography variant="body2"> {card.subject} </Typography>
                  {card.online ? (
                    <Typography variant="body2" color="success">
                      Virtual Available
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error">
                      {" "}
                      In-person Only{" "}
                    </Typography>
                  )}
                  <Typography variant="body2"> {card.location}</Typography>
                </CardContent>
                <CardActions>
                  {" "}
                  <PrimaryButton
                    text="Request Appointment"
                    onClick={requestApp}
                  />
                </CardActions>
              </Card>
            }
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Results;
