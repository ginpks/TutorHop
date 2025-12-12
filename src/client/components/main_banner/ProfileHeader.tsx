import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Person, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  profilePicUrl?: string;
  displayName?: string;
  onProfileClick?: () => void;
  userType?: string;
}

function ProfileHeader({
  profilePicUrl,
  displayName,
  userType,
  onProfileClick,
}: Readonly<ProfileHeaderProps>) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    onProfileClick?.();
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    navigate("/");
  };

  const getInitial = () => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    return "?";
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
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

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
          },
        }}
      >
        {displayName && (
          <MenuItem disabled sx={{ opacity: 1, cursor: "default" }}>
            <ListItemText
              primary={displayName}
              secondary={userType}
              primaryTypographyProps={{ fontWeight: 600 }}
              secondaryTypographyProps={{ fontSize: "0.85rem" }}
            />
          </MenuItem>
        )}

        {displayName && <Divider />}

        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Log Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileHeader;
