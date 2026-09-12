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
        color: "#3C3744",
        fontWeight: "bold",
        boxShadow: "0 2px 8px rgba(60, 55, 68, 0.18)",
        "&:hover": {
          bgcolor: "#9AB0D9",
          boxShadow: "0 5px 16px rgba(60, 55, 68, 0.28)",
          transform: "translateY(-1px)",
        },
        "&:active": { transform: "translateY(0)" },
        transition:
          "background-color .2s ease, box-shadow .2s ease, transform .15s ease",
        "&:focus": { outline: "none" },
      }}
      type={type}
    >
      {text}
    </Button>
  );
}

export default PrimaryButton;
