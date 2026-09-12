import { ButtonProps } from "./primary-button";
import { Button } from "@mui/material";

function SecondaryButton({
  text,
  px = 1,
  py = 1,
  onClick,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        px,
        py,
        bgcolor: "transparent",
        color: "#3C3744",
        borderColor: "rgba(60, 55, 68, 0.35)",
        fontWeight: "bold",
        borderWidth: 1.5,
        "&:hover": {
          borderColor: "#3C3744",
          bgcolor: "rgba(60, 55, 68, 0.06)",
          borderWidth: 1.5,
        },
        "&:focus": { outline: "none" },
      }}
    >
      {text}
    </Button>
  );
}

export default SecondaryButton;
