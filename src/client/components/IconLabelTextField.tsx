import { useState, ReactNode } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import TextsmsIcon from "@mui/icons-material/Textsms";

export interface IconLabelTextFieldProps extends Omit<TextFieldProps, "label"> {
  labelText?: string;
  labelIcon?: ReactNode;
  showIconWhenFilled?: boolean;
}

export default function IconLabelTextField({
  labelText = "Tell us in your own words",
  labelIcon = <TextsmsIcon fontSize="small" />,
  showIconWhenFilled = false,
  value = "",
  onChange,
  ...textFieldProps
}: IconLabelTextFieldProps) {
  const [focused, setFocused] = useState(false);

  const showIcon = !focused && (showIconWhenFilled || value === "");

  return (
    <TextField
      {...textFieldProps}
      label={
        showIcon ? (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {labelIcon}
            {labelText}
          </span>
        ) : (
          labelText
        )
      }
      value={value}
      fullWidth
      multiline
      maxRows={3}
      onChange={(e) => {
        onChange?.(e);
      }}
      onFocus={(e) => {
        setFocused(true);
        textFieldProps.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        textFieldProps.onBlur?.(e);
      }}
    />
  );
}
