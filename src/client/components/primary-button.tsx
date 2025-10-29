import { Button } from "@mui/material";

export interface ButtonProps {
  text: string;
  px?: number;
  py?: number;
  onClick?: () => void;
}

function PrimaryButton({ text, px = 1, py = 1, onClick }: ButtonProps) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        px,
        py,
        bgcolor: "#B4C5E4",
        color: "#FBFFF1",
        fontWeight: "bold",
        "&:focus": { outline: "none" },
      }}
    >
      {text}
    </Button>
  );
}

export default PrimaryButton;
