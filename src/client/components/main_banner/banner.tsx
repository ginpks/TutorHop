import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import { roleLabels, UserRole } from "../../../shared/Enums/UserEnums";
import { useNavigate, useLocation } from "react-router-dom";

interface DefaultBannerProps {
  title: string;
  profilePicUrl?: string;
  displayName?: string;
  bannerStyle?: React.CSSProperties;
  isLoggedIn: boolean;
  onProfileClick?: () => void;
  userType?: string;
}

const styles: React.CSSProperties = {
  height: "min-content",
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  color: "#3C3744",
};

function DefaultBanner({
  title,
  profilePicUrl,
  displayName,
  bannerStyle,
  isLoggedIn,
  onProfileClick,
  userType,
}: Readonly<DefaultBannerProps>) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar
      position="static"
      sx={{
        ...(bannerStyle ?? styles),
        background: "linear-gradient(90deg, #B4C5E4 0%, #7A93C9 100%)",
      }}
    >
      <Toolbar
        sx={{ display: "flex", alignItems: "center", padding: 0.4, gap: 2 }}
      >
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            cursor: isLoggedIn ? "pointer" : "default",
            "&:hover": isLoggedIn ? { opacity: 0.85 } : {},
          }}
          onClick={() => isLoggedIn && navigate("/landing")}
        >
          {title}
        </Typography>

        {isLoggedIn &&
          userType === "Student" &&
          location.pathname !== "/survey" && (
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FBFFF1",
                color: "#3C3744",
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#F0F5E1",
                },
              }}
              onClick={() => navigate("/survey")}
            >
              Find Tutor
            </Button>
          )}

        {isLoggedIn && (
          <ProfileHeader
            profilePicUrl={profilePicUrl}
            displayName={displayName}
            userType={userType || roleLabels[UserRole?.STUDENT]}
            onProfileClick={onProfileClick}
          />
        )}
      </Toolbar>
    </AppBar>
  );
}

export default DefaultBanner;
