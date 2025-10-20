import React from "react";
import { Card, IconButton } from "@mui/material";

interface ProfileHeaderProps {
  profilePicUrl?: string;
  displayName?: string;
  onClick?: () => void;
}

function ProfileHeader({
  profilePicUrl,
  displayName,
  onClick,
}: Readonly<ProfileHeaderProps>) {
  const avatarStyle: React.CSSProperties = {
    width: "50px",
    height: "50px",
    borderRadius: "100%",
  };
  return (
    <IconButton
      onClick={onClick}
      sx={{
        ml: 2,
        p: 1,
        boxShadow: 0,
        padding: 0,
        bgcolor: "transparent",
      }}
    >
      {profilePicUrl ? (
        <img src={profilePicUrl} alt={displayName} style={avatarStyle} />
      ) : (
        <img
          style={avatarStyle}
          src="src/client/assets/icons/blank_pp.png"
          alt="Default Profile"
        />
      )}
    </IconButton>
  );
}

export default ProfileHeader;
