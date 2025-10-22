import React from "react";
import { AppBar, Card, Toolbar, Typography } from "@mui/material";
import ProfileHeader from "./ProfileHeader";
import { roleLabels, UserRole } from "../../../shared/Enums/UserEnums";

interface DefaultBannerProps {
  title: string;
  profilePicUrl?: string;
  displayName?: string;
  bannerStyle?: React.CSSProperties;
}

const avatarStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  borderRadius: "100%",
};

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
}: Readonly<DefaultBannerProps>) {
  return (
    <AppBar
      position="static"
      sx={{
        ...(bannerStyle ?? styles),
        bgcolor: "#B4C5E4",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {" "}
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <ProfileHeader
          profilePicUrl={profilePicUrl}
          displayName={displayName}
          onClick={() => {}}
          userType={roleLabels[UserRole?.STUDENT]}
        />
      </Toolbar>
    </AppBar>
  );
}

export default DefaultBanner;
