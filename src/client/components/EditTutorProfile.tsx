import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, ReactNode, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PillPicker from "./pill-picker";
import { subjects } from "../../../drizzle/schema";
interface EditTutorProfileProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: string[];
  allSubjects?: string[];
}

function EditTutorProfile({
  isOpen,
  onClose,
  subjects,
  allSubjects,
}: Readonly<EditTutorProfileProps>) {
  if (!isOpen) return null;

  const onPrimaryChange = (value: string[]) => {};

  function handleChange(
    event:
      | ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } }),
    child: ReactNode
  ): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <Typography>Edit Your Profile</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: 5 }}>
          <DialogContentText>
            Choose what subjects you specialise in.
          </DialogContentText>
          <PillPicker
            options={allSubjects ?? []}
            value={subjects}
            onChange={onPrimaryChange}
          ></PillPicker>
        </Box>
        <Box>
          <DialogContentText></DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Meeting Preferences</InputLabel>
            <Select onChange={handleChange}>
              <MenuItem value={"in_person"}>In Person</MenuItem>
              <MenuItem value={"zoom"}>Online</MenuItem>
              <MenuItem value={"either"}>Either</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default EditTutorProfile;
