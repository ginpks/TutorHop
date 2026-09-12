import { createTheme, alpha } from "@mui/material/styles";

/**
 * Tutor Hop design tokens — single source of truth for the look & feel.
 * Colors mirror the palette already used across the app so nothing shifts.
 */
export const palette = {
  bg: "#FBFFF1",
  surface: "#FFFFFF",
  light: "#B4C5E4",
  lightHover: "#9AB0D9",
  primary: "#3D52D5",
  dark: "#090C9B",
  text: "#3C3744",
  sectionBg: "#E9F4F4",
  headerPill: "#B9C1E9",
};

export const shadows = {
  card: "0 2px 12px rgba(60, 55, 68, 0.08)",
  cardHover: "0 10px 28px rgba(60, 55, 68, 0.16)",
  button: "0 2px 8px rgba(9, 12, 155, 0.18)",
  buttonHover: "0 5px 16px rgba(9, 12, 155, 0.28)",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.primary,
      light: palette.light,
      dark: palette.dark,
    },
    secondary: {
      main: palette.headerPill,
    },
    background: {
      default: palette.bg,
      paper: palette.surface,
    },
    text: {
      primary: palette.text,
      secondary: alpha(palette.text, 0.65),
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.bg,
          color: palette.text,
        },
        "::selection": {
          backgroundColor: alpha(palette.primary, 0.25),
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition:
            "background-color .2s ease, box-shadow .2s ease, transform .15s ease, color .2s ease",
          "&:focus-visible": {
            outline: `2px solid ${alpha(palette.primary, 0.6)}`,
            outlineOffset: 2,
          },
        },
        contained: {
          boxShadow: shadows.button,
          "&:hover": {
            boxShadow: shadows.buttonHover,
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: shadows.button,
          },
          "&:disabled": {
            opacity: 0.55,
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(60, 55, 68, 0.08)",
          boxShadow: shadows.card,
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          transition: "box-shadow .2s ease",
          "&:hover": {
            boxShadow: `0 0 0 3px ${alpha(palette.light, 0.25)}`,
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 3px ${alpha(palette.light, 0.4)}`,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: "1px solid rgba(60, 55, 68, 0.08)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "background-color .2s ease, box-shadow .2s ease",
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
});

export default theme;
