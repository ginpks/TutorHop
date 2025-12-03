import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import ExampleCardComponent from "../components/example";
import DefaultBanner from "../components/main_banner/banner";
import React from "react";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import type { SelectChangeEvent } from "@mui/material/Select";
import { UserRole } from "../../shared/Enums/UserEnums";
import { useNavigate } from "react-router-dom";
type FormState = {
  accountType: UserRole;
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
  accountType: UserRole.STUDENT,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  subjects: "",
  meetingPreference: "",
};

function Signup() {
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [signUpCompleted, setSignUpCompleted] = React.useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Prepare signup data with hardcoded defaults
      const signupData = {
        ...form,
        subjects: "NA",
        meetingPreference: "either",
      };

      const res = await fetch("/accounts/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        setErrorMessage("Failed to create account. Please try again.");
        return;
      }

      setSignUpCompleted(true);
      navigate("/");
    } catch (err) {
      console.error("Error fetching the sign up api: ", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  }

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
      <DefaultBanner title="Tutor Hop" isLoggedIn={false} />
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

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: "100%", maxWidth: 480, mx: "auto" }}
        >
          <Stack spacing={2}>
            <TextField
              select
              label="Account type"
              name="accountType"
              required
              fullWidth
              value={form.accountType}
              onChange={(e) => {
                const next = e.target.value as UserRole;
                setForm((prev) =>
                  next === UserRole.STUDENT
                    ? {
                        ...prev,
                        accountType: UserRole.STUDENT,
                      }
                    : {
                        ...prev,
                        accountType: UserRole.TUTOR,
                      },
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
              type="password"
              required
              fullWidth
              value={form.password}
              onChange={handleChange}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              fullWidth
              value={form.confirmPassword}
              onChange={handleChange}
            />

            {errorMessage && (
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            )}

            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 2, width: "100%", "& > *": { flex: 1, minHeight: 56 } }}
            >
              <SecondaryButton text="Back"></SecondaryButton>
              <PrimaryButton
                text="Create Account"
                type="submit"
              ></PrimaryButton>
            </Stack>

            <Typography
              variant="body2"
              color="primary"
              align="center"
              sx={{ mt: 1, cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/")}
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
