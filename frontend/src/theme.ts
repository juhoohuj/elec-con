import { createTheme, type PaletteMode } from "@mui/material/styles";

const sharedOptions = {
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
} as const;

export function getTheme(mode: PaletteMode) {
  return createTheme({
    ...sharedOptions,
    palette:
      mode === "light"
        ? {
            mode,
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
          }
        : {
            mode,
            primary: {
              main: "#5FC1DB",
              dark: "#3A96AF",
              light: "#8ED4E6",
              contrastText: "#04222B",
            },
            secondary: {
              main: "#F2B65A",
              contrastText: "#1A1A1A",
            },
            background: {
              default: "#10151A",
              paper: "#181F26",
            },
            error: {
              main: "#E57373",
            },
            text: {
              primary: "#E8ECEE",
              secondary: "#9AA7AC",
            },
          },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: `1px solid ${mode === "light" ? "#E1E7E9" : "#242C33"}`,
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
}
