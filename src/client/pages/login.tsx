import React from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DefaultBanner from "../components/main_banner/banner";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
};

const initialForm: LoginForm = { email: "", password: "" };

function isValidEmail(v: string) {
  // simple email check; good enough for client-side UX
  return /\S+@\S+\.\S+/.test(v);
}

export default function Login() {
  const [form, setForm] = React.useState<LoginForm>(initialForm);
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const emailError = form.email !== "" && !isValidEmail(form.email);
  const passwordError = form.password !== "" && form.password.length < 6;

  const isDisabled =
    submitting ||
    !form.email ||
    !form.password ||
    emailError ||
    passwordError;

  const handleChange =
    (name: keyof LoginForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [name]: e.target.value }));
      setError(null);
      setMessage(null);
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isDisabled) return;

    try {
      setSubmitting(true);

      console.log("User logged in")

      
      await new Promise((r) => setTimeout(r, 600));
      setMessage(`Signed in as ${form.email}`);
      // navigate("/profile"); // uncomment to go to profile or whatever
    } catch (err: any) {
      setError(err?.message ?? "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "#FBFFF1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top banner */}
      <DefaultBanner title="Tutor Hop" isLoggedIn={false} />


      {/* Centered card */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          px: 2,
          py: { xs: 3, sm: 6 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 480,
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
          }}
        >
          <Stack spacing={2}>
            <Typography
              color="#3C3744"
              variant="h4"
              fontWeight="bold"
              align="center"
            >
              Login
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  fullWidth
                  value={form.email}
                  onChange={handleChange("email")}
                  error={emailError}
                  helperText={emailError ? "Enter a valid email." : " "}
                />

                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  fullWidth
                  value={form.password}
                  onChange={handleChange("password")}
                  error={passwordError}
                  helperText={
                    passwordError ? "Password must be at least 6 characters." : " "
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: 1,
                    "& > *": { flex: 1, minHeight: 48 },
                  }}
                >
                  <SecondaryButton
                    text="Back"
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                  />

                  {/* Make this a real submit */}
                  {/*
                    
                  */}
                  <PrimaryButton
                    text="Login"
                    disabled={isDisabled}
                  />
                </Stack>

                <Typography
                  variant="body2"
                  color="primary"
                  align="center"
                  sx={{ mt: 1, cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/signup")}
                >
                  Don&apos;t have an account? Sign up
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
