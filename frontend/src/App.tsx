import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import { DailyStatsPage } from "./features/days/DailyStatsPage";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="transparent" sx={{ bgcolor: "background.paper" }}>
        <Toolbar>
          <BoltIcon sx={{ color: "primary.main", mr: 1.5 }} />
          <Box>
            <Typography variant="h6" component="h1" sx={{ lineHeight: 1.2 }}>
              Sähkötilastot
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suomen sähkön tuotanto, kulutus ja hinta päivätasolla
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <DailyStatsPage />
      </Container>
    </Box>
  );
}

export default App;
