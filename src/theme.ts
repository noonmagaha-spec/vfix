// ============================================================
// V-FIX — MUI Theme Configuration
// Soft blue, clean, modern, professional
// ============================================================

import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2E86DE",
      light: "#74B9FF",
      dark: "#1B6CB5",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#6C5CE7",
      light: "#A29BFE",
      dark: "#4834D4",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#00B894",
      light: "#55EFC4",
      dark: "#00896E",
    },
    warning: {
      main: "#FDCB6E",
      light: "#FFEAA7",
      dark: "#E17055",
    },
    error: {
      main: "#E74C3C",
      light: "#FAB1A0",
      dark: "#C0392B",
    },
    info: {
      main: "#0984E3",
      light: "#74B9FF",
      dark: "#0652DD",
    },
    background: {
      default: "#F0F4F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D3436",
      secondary: "#636E72",
    },
    divider: alpha("#2D3436", 0.08),
  },
  typography: {
    fontFamily: '"Sarabun", "Prompt", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: "0.8rem",
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
    },
    body2: {
      color: "#636E72",
    },
    button: {
      textTransform: "none" as const,
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
    "0 2px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.06)",
    "0 4px 12px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
    "0 6px 16px rgba(0,0,0,0.06), 0 3px 6px rgba(0,0,0,0.04)",
    "0 8px 24px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.04)",
    "0 10px 28px rgba(0,0,0,0.08), 0 5px 10px rgba(0,0,0,0.04)",
    "0 12px 32px rgba(0,0,0,0.08)",
    "0 14px 36px rgba(0,0,0,0.09)",
    "0 16px 40px rgba(0,0,0,0.10)",
    "0 18px 44px rgba(0,0,0,0.10)",
    "0 20px 48px rgba(0,0,0,0.10)",
    "0 22px 52px rgba(0,0,0,0.10)",
    "0 24px 56px rgba(0,0,0,0.10)",
    "0 26px 60px rgba(0,0,0,0.10)",
    "0 28px 64px rgba(0,0,0,0.10)",
    "0 30px 68px rgba(0,0,0,0.10)",
    "0 32px 72px rgba(0,0,0,0.10)",
    "0 34px 76px rgba(0,0,0,0.10)",
    "0 36px 80px rgba(0,0,0,0.10)",
    "0 38px 84px rgba(0,0,0,0.10)",
    "0 40px 88px rgba(0,0,0,0.10)",
    "0 42px 92px rgba(0,0,0,0.10)",
    "0 44px 96px rgba(0,0,0,0.10)",
    "0 46px 100px rgba(0,0,0,0.10)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 20px",
          fontSize: "0.875rem",
        },
        contained: {
          boxShadow: "0 2px 8px rgba(46,134,222,0.25)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(46,134,222,0.35)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.04)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 700,
            fontSize: "0.8rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.05em",
            color: "#636E72",
            backgroundColor: "#F7F9FC",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(46,134,222,0.04) !important",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme;
