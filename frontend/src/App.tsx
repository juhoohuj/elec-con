import { useMemo } from "react";
import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Tooltip, IconButton, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { DailyStatsPage } from "./features/days/DailyStatsPage";
import { getTheme } from "./theme";
import { useColorMode } from "./useColorMode";

function App() {
  const { mode, toggleMode } = useColorMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="static" color="transparent" sx={{ bgcolor: "background.paper" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BoltIcon sx={{ color: "primary.main", mr: 1.5 }} />
              <Box>
                <Typography variant="h6" component="h1" sx={{ lineHeight: 1.2 }}>
                  Sähkötilastot
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Suomen sähkön tuotanto, kulutus ja hinta päivätasolla
                </Typography>
              </Box>
            </Box>

            <Tooltip title={mode === "dark" ? "Vaihda vaaleaan teemaan" : "Vaihda tummaan teemaan"}>
              <IconButton onClick={toggleMode} color="inherit" aria-label="Vaihda teemaa">
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          <DailyStatsPage />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
