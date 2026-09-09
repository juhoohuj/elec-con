import { createTheme } from "@mui/material/styles";

// Custom theme instead of MUI's default
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F6E8C",
      dark: "#0A4F63",
      light: "#4C93AC",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E8A23D",
      contrastText: "#1A1A1A",
    },
    background: {
      default: "#F4F7F8",
      paper: "#FFFFFF",
    },
    error: {
      main: "#D64545",
    },
    text: {
      primary: "#1B2226",
      secondary: "#5B6B72",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #E1E7E9",
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
  },
});
