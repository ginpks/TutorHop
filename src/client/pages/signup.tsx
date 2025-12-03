import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  MenuItem,
  IconButton, 
  InputAdornment
} from "@mui/material";
import DefaultBanner from "../components/main_banner/banner";
import React from "react";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


type AccountType = "student" | "tutor";
type MeetingPreference = "in_person" | "zoom" | "hybrid";

type FormState = {
  accountType: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  subjects: string;
  availability: string; 
  meetingPreference: MeetingPreference | "";
};

const initialForm: FormState = {
  accountType: UserRole.STUDENT,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  subjects: "",
  availability: "",
  meetingPreference: "",
};

const availabilityOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function isValidEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v);
}

function Signup() {
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate = useNavigate();

  // generic handler for text/select fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountTypeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const next = e.target.value as AccountType;
    setForm((prev) => ({
      ...prev,
      accountType: next,
      availability: next === "tutor" ? prev.availability : "",
    }));
  };

  // ----- validation booleans (always based on current values) -----
  const emailError =
    form.email !== "" && !isValidEmail(form.email);

  const passwordTooShort =
    form.password !== "" && form.password.length < 6;

  const passwordMismatch =
    form.password !== "" &&
    form.confirmPassword !== "" &&
    form.password !== form.confirmPassword;

  const subjectsMissing = form.subjects.trim() === "";
  const meetingPreferenceMissing = form.meetingPreference === "";
  const availabilityMissing =
    form.accountType === "tutor" && form.availability === "";

  // button disabled based on current values
  const isDisabled =
    !form.firstName ||
    !form.lastName ||
    !form.email ||
    !form.password ||
    !form.confirmPassword ||
    subjectsMissing ||
    meetingPreferenceMissing ||
    emailError ||
    passwordTooShort ||
    passwordMismatch ||
    availabilityMissing;

  const handleCreateAccount = () => {
    if (isDisabled) {
      // just don't submit if invalid; errors are already visible
      return;
    }

    // TODO: send to backend
    console.log("Form values:", form);
    // navigate("/profile");
  };

  return (
    <Card
      sx={{
        minHeight: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        borderRadius: 0,
        alignItems: "top",
        bgcolor: "#FBFFF1",
        border: "none",
        boxShadow: "none",

      }}
    >
      <DefaultBanner title="Tutor Hop" />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 6,
        }}
      >
        <Stack sx={{ width: "100%", maxWidth: 480, mx: "auto", mb: 3 }}>
          <Typography
            color="#3C3744"
            variant="h4"
            fontWeight="bold"
            align="center"
            sx={{ mb: 2 }}
          >
            Enter Your Account Details
          </Typography>
        </Stack>

        {/* Form container (we're not using native submit here) */}
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          noValidate
          sx={{ width: "100%", maxWidth: 480, mx: "auto" }}
        >
          <Stack spacing={2}>
            {/* Account type */}
            <TextField
              select
              label="Account type"
              name="accountType"
              required
              fullWidth
              value={form.accountType}
              onChange={handleAccountTypeChange}
              helperText=" "
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="tutor">Tutor</MenuItem>
            </TextField>

            {/* Names */}
            <TextField
              label="First Name"
              name="firstName"
              required
              fullWidth
              value={form.firstName}
              onChange={handleChange}
              helperText=" "
            />

            <TextField
              label="Last Name"
              name="lastName"
              required
              fullWidth
              value={form.lastName}
              onChange={handleChange}
              helperText=" "
            />

            {/* Email */}
            <TextField
              label="Email Address"
              name="email"
              required
              fullWidth
              value={form.email}
              onChange={handleChange}
              error={emailError}
              helperText={
                emailError ? "Enter a valid email address." : " "
              }
            />

            {/* Password */}
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              value={form.password}
              onChange={handleChange}
              error={passwordTooShort || passwordMismatch}
              helperText={
                passwordTooShort
                  ? "Password must be at least 6 characters."
                  : passwordMismatch
                  ? "Passwords do not match."
                  : " "
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />


            {/* Confirm Password */}
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              fullWidth
              value={form.confirmPassword}
              onChange={handleChange}
              error={passwordMismatch}
              helperText={passwordMismatch ? "Passwords must match." : " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            

            {/* Subjects */}
            {form.accountType === "student" && (
              <TextField
                label="Subjects of Study"
                name="subjects"
                value={form.subjects}
                onChange={handleChange}
                fullWidth
                required
                error={subjectsMissing && form.subjects !== ""}
                helperText={
                  subjectsMissing && form.subjects !== ""
                    ? "Please enter at least one subject."
                    : " "
                }
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
                  error={subjectsMissing && form.subjects !== ""}
                  helperText={
                    subjectsMissing && form.subjects !== ""
                      ? "Please enter at least one subject."
                      : " "
                  }
                />

                {/* Availability dropdown */}
                <TextField
                  select
                  label="Availability"
                  name="availability"
                  required
                  fullWidth
                  value={form.availability}
                  onChange={handleChange}
                  error={availabilityMissing}
                  helperText={
                    availabilityMissing
                      ? "Please select your availability."
                      : " "
                  }
                >
                  {availabilityOptions.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}

            {/* Meeting Preference dropdown */}
            <TextField
              select
              label="Meeting Preference"
              name="meetingPreference"
              required
              fullWidth
              value={form.meetingPreference}
              onChange={handleChange}
              error={meetingPreferenceMissing}
              helperText={
                meetingPreferenceMissing
                  ? "Please choose a meeting preference."
                  : " "
              }
            >
              <MenuItem value="in_person">In-person</MenuItem>
              <MenuItem value="zoom">Zoom</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
            </TextField>

            {/* Buttons */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 2, width: "100%", "& > *": { flex: 1, minHeight: 56 } }}
            >
              <SecondaryButton text="Back" onClick={() => navigate(-1)} />
              <PrimaryButton
                text="Create Account"
                disabled={isDisabled}
                onClick={handleCreateAccount}
              />
            </Stack>

            <Typography
              variant="body2"
              color="primary"
              align="center"
              sx={{ cursor: "pointer", mt: 1, textDecoration: "underline" }}
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign in
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Signup;
