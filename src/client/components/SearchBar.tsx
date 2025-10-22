import React from "react";
import { Box, Card, CardContent, List, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Search from "@mui/icons-material/Search";
interface UserSearchBarProps {
  userType: string;
}

function UserSearchBar({ userType }: Readonly<UserSearchBarProps>) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Search></Search>
    </Box>
  );
}

export default UserSearchBar;
