import React from "react";
import { Box, IconButton, Typography } from "@mui/material";

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
  const avatarStyle: React.CSSProperties = {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        p: 0,
      }}
    >
      <IconButton
        onClick={onClick}
        sx={{
          p: 0,
          m: 0,
          bgcolor: "transparent",
        }}
      >
        <img
          src={profilePicUrl || "src/client/assets/icons/blank_pp.png"}
          alt={displayName || "Default Profile"}
          style={avatarStyle}
        />
      </IconButton>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {userType} Account
      </Typography>
    </Box>
  );
}

export default ProfileHeader;
