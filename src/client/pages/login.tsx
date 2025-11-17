import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import DefaultBanner from "../components/main_banner/banner";
import React from "react";
import PrimaryButton from "../components/primary-button";
import SecondaryButton from "../components/secondary-button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true; // allow cookies from backend

type LoginForm = {
  email: string;
  password: string;
};

const initialForm: LoginForm = {
  email: "",
  password: "",
};

function Login() {
  const [form, setForm] = React.useState<LoginForm>(initialForm);
  const [error, setError] = React.useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/login", {
        email: form.email,
        password: form.password,
      });

      const accessToken = res.data.accessToken;

      // Store temporarily
      sessionStorage.setItem("accessToken", accessToken);

      console.log("Logged in, token:", accessToken);

      // this should be changed where / is the login page and the landing page is /landing
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
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
            Login
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

            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 2,
                width: "100%",
                "& > *": { flex: 1, minHeight: 56 },
              }}
            >
              <SecondaryButton text="Back" />
              <PrimaryButton text="Login" />
            </Stack>

            <Typography variant="body2" color="text.secondary" align="center">
              Don’t have an account? Sign up
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Login;
