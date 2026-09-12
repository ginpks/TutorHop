import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import ProfileHeader from "./ProfileHeader";
import { roleLabels, UserRole } from "../../../shared/Enums/UserEnums";
import { useNavigate, useLocation } from "react-router-dom";
import { alpha } from "@mui/material/styles";

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
        boxShadow: "0 2px 12px rgba(60, 55, 68, 0.15)",
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
            transition: "opacity 0.2s ease",
            "&:hover": isLoggedIn ? { opacity: 0.85 } : {},
          }}
          onClick={() => isLoggedIn && navigate("/landing")}
        >
          {title}
        </Typography>

        {isLoggedIn &&
          userType === "Student" &&
          location.pathname !== "/survey" && (
            <Typography
              onClick={() => navigate("/survey")}
              sx={{
                cursor: "pointer",
                fontWeight: 700,
                px: 2.5,
                py: 1,
                borderRadius: 2.5,
                color: "#3C3744",
                bgcolor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(60, 55, 68, 0.12)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 1)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(60, 55, 68, 0.18)",
                },
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <AutoStoriesRoundedIcon fontSize="small" />
              Find Tutor
            </Typography>
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
