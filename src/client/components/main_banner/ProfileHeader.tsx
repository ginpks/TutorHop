import React from "react";
import { Box, IconButton, Typography, Avatar } from "@mui/material";

interface ProfileHeaderProps {
  profilePicUrl?: string;
  displayName?: string;
  onClick?: () => void;
  userType?: string;
}

function ProfileHeader({
  profilePicUrl,
  displayName,
  onClick,
  userType,
}: Readonly<ProfileHeaderProps>) {
  const getInitial = () => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    return "?";
  };

  return (
    <IconButton
      onClick={onClick}
      sx={{
        p: 0,
        m: 0,
        bgcolor: "transparent",
      }}
    >
      <Avatar
        src={profilePicUrl}
        alt={displayName || "Profile"}
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#3C3744",
          fontSize: "1.2rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {getInitial()}
      </Avatar>
    </IconButton>
  );
}

export default ProfileHeader;
