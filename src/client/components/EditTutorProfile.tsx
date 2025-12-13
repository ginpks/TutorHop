import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, ReactNode, useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PillPicker from "./pill-picker";
import PrimaryButton from "./primary-button";
import SecondaryButton from "./secondary-button";

interface EditTutorProfileProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: string[];
  allSubjects?: string[];
  onSave?: (data: { subjects: string[]; meetingPreference: string }) => void;
}

function EditTutorProfile({
  isOpen,
  onClose,
  subjects,
  allSubjects,
  onSave,
}: Readonly<EditTutorProfileProps>) {
  // Local state for form fields
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(subjects);
  const [meetingPreference, setMeetingPreference] = useState<string>("either");

  // Update local state when props change
  useEffect(() => {
    if (isOpen) {
      setSelectedSubjects(subjects);
    }
  }, [isOpen, subjects]);

  if (!isOpen) return null;

  const handleSubjectsChange = (value: string[]) => {
    setSelectedSubjects(value);
  };

  const handleMeetingPreferenceChange = (
    event: ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value as string;
    setMeetingPreference(value);
  };

  const handleSave = () => {
    // Call the onSave callback with the updated data
    if (onSave) {
      onSave({
        subjects: selectedSubjects,
        meetingPreference,
      });
    }
    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    setSelectedSubjects(subjects);
    setMeetingPreference("either");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Edit Your Profile
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: 3, marginTop: 2 }}>
          <DialogContentText sx={{ marginBottom: 2 }}>
            Choose what subjects you specialise in.
          </DialogContentText>
          <PillPicker
            options={allSubjects ?? []}
            value={selectedSubjects}
            onChange={handleSubjectsChange}
            placeholder="Select subjects..."
          />
        </Box>
        <Box>
          <DialogContentText sx={{ marginBottom: 1 }}>
            Select your meeting preferences.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Meeting Preferences</InputLabel>
            <Select
              value={meetingPreference}
              onChange={handleMeetingPreferenceChange}
              label="Meeting Preferences"
            >
              <MenuItem value="in_person">In Person</MenuItem>
              <MenuItem value="zoom">Online / Zoom</MenuItem>
              <MenuItem value="either">Either</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <SecondaryButton text="Cancel" onClick={handleCancel} px={3} />
        <PrimaryButton text="Save Changes" onClick={handleSave} px={3} />
      </DialogActions>
    </Dialog>
  );
}

export default EditTutorProfile;
