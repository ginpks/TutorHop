import { Button } from "@mui/material";

export interface ButtonProps {
  text: string;
  px?: number;
  py?: number;
  onClick?: () => void;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  fullWidth?: boolean;
}

function PrimaryButton({
  text,
  px = 1,
  py = 1,
  onClick,
  disabled = false,
  type,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Button
      variant="contained"
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      sx={{
        px,
        py,
        bgcolor: "#B4C5E4",
        color: "#FBFFF1",
        fontWeight: "bold",
        "&:focus": { outline: "none" },
      }}
      type={type}
    >
      {text}
    </Button>
  );
}

export default PrimaryButton;
