import { Box, Card, CardContent, Typography, Stack, TextField, Button, MenuItem} from "@mui/material";
import ExampleCardComponent from "../components/example";
import DefaultBanner from "../components/main_banner/banner";
import React from "react";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import type { SelectChangeEvent } from "@mui/material/Select";

type AccountType = "student" | "tutor"
// Sign-Up form variables
type FormState = {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  subjects: string;
  availability?: string;
  meetingPreference: string;
};

const initialForm: FormState = {
  accountType: "student",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  subjects: "",
  meetingPreference: "",
};

function Signup() {
  const [form, setForm] = React.useState<FormState>(initialForm)

  //Updates state when input is changed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name]: value}))
  };

  //sends submission to database and created new account
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO
    console.log("Form values:", form);
  };
  
  return (
    <Card
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        alignItems: "top",
        bgcolor: "#FBFFF1",
        border: "none",
        boxShadow: "none",
      }}
    >
      <DefaultBanner
        title="Tutor Hop"
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 6,
        }}
      >
        <Stack sx = {{width: "100%", maxWidth: 480, mx: "auto", mb: 3}}>
          <Typography color="#3C3744" variant="h4" fontWeight="bold" align="center" sx={{ mb: 2 }}>
            Enter Your Account Details
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: "100%", maxWidth: 480, mx: "auto" }}
        >
          <Stack spacing = {2}>
            <TextField
              select
              label="Account type"
              name="accountType"
              required
              fullWidth
              value={form.accountType}
              onChange={(e) => {
                const next = e.target.value as AccountType;
                setForm(prev =>
                  next === "student"
                    ? {
                        ...prev,
                        accountType: "student",
                      }
                    : {
                        ...prev,
                        accountType: "tutor",
                      }
                );
              }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="tutor">Tutor</MenuItem>
            </TextField>

            <TextField
              label="First Name"
              name="firstName"
              required
              fullWidth
              value={form.firstName}
              onChange={handleChange}
              />

              <TextField
              label="Last Name"
              name="lastName"
              required
              fullWidth
              value={form.lastName}
              onChange={handleChange}
              />

              <TextField
              label="Email Address"
              name="email"
              required
              fullWidth
              value={form.email}
              onChange={handleChange}
              />

              <TextField
              label="Password"
              name="password"
              required
              fullWidth
              value={form.password}
              onChange={handleChange}
              />

              <TextField
              label="Confirm Password"
              name="confirmPassword"
              required
              fullWidth
              value={form.confirmPassword}
              onChange={handleChange}
              />
              
              {form.accountType === "student" && (
                  <TextField
                    label="Subjects of Study"
                    name="subjects"
                    value={form.subjects}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
              )}

              {form.accountType === "tutor" && (
                <>
                  <TextField
                    label="Subjects of Expertise"
                    name="subjects"
                    value={form.subjects}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Availability"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </>
              )}

              <TextField
              label="Meeting Preference"
              name="meetingPreference"
              required
              fullWidth
              value={form.meetingPreference}
              onChange={handleChange}
              />

            <Stack direction="row" spacing={2} sx={{ mt: 2, width: "100%", "& > *": { flex: 1, minHeight: 56 }, }}>
              <SecondaryButton text="Back"></SecondaryButton>
              <PrimaryButton text="Create Account"></PrimaryButton>
            </Stack>


            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account? Sign in
            </Typography>

          </Stack>
        </Box>
      </CardContent>

  </Card>
  );
}

export default Signup;
