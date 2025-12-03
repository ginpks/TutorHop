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
import { useNavigate } from "react-router-dom";

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
  const [message, setMessage] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [jwtToken, setJwtToken] = React.useState<any>();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const loginData = await res.json();
        const jwt = loginData.token;

        // Store token in localStorage
        localStorage.setItem("token", jwt);

        const query = new URLSearchParams({ token: jwt });
        const dataRes = await fetch(`/accounts/data?${query.toString()}`);

        if (!dataRes.ok) {
          setMessage("Authentication verification failed. Please try again.");
          return;
        }

        const verified = await dataRes.json();

        setJwtToken(jwt);
        setUser(loginData.user);

        navigate("/landing");
      } else if (res.status === 403) {
        setMessage("Invalid email or password. Please try again.");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching the login api: ", err);
      setMessage(
        "An error occurred. Please check your connection and try again.",
      );
    }
  }
  const isDisabled = !form.email || !form.password;

  return (
    <>
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

              {message && (
                <Typography color="error" align="center" sx={{ mt: 1 }}>
                  {message}
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
                <PrimaryButton text="Login" disabled={false} type="submit" />
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
        </CardContent>
      </Card>
    </>
  );
}

export default Login;
