import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LineChart } from "@mui/x-charts/LineChart";
import { fetchSingleDayStats } from "./singleDayApi";
import { formatDate, formatEnergy, formatHour, formatPrice } from "./format";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, flex: "1 1 200px" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">{value || "Ei dataa"}</Typography>
    </Paper>
  );
}

export function SingleDayDialog({ date, onClose }: { date: string | null; onClose: () => void }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["single-day", date],
    queryFn: () => fetchSingleDayStats(date!),
    enabled: !!date,
  });

  return (
    <Dialog open={date !== null} onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <span>{data ? formatDate(data.date) : ""}</span>
          {data?.isIncompleteDay && (
            <Chip
              label={`Vajaa data (${data.hoursRecorded}/24 tuntia)`}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {isLoading && <CircularProgress />}
        {isError && <Alert severity="error">{(error as Error).message}</Alert>}

        {data && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              <StatCard label="Kulutus yhteensä" value={formatEnergy(data.totalConsumptionKwh, "kWh")} />
              <StatCard label="Tuotanto yhteensä" value={formatEnergy(data.totalProductionMwh, "MWh")} />
              <StatCard label="Keskihinta" value={formatPrice(data.averagePriceEurPerMwh)} />
              <StatCard
                label="Pisin negatiivinen jakso"
                value={`${data.longestNegativePriceStreakHours} h`}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              <Paper variant="outlined" sx={{ p: 2, flex: "1 1 320px" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tunti jolloin kulutus oli suhteessa suurin verrattuna tuotantoon
                </Typography>
                {data.hourWithMostConsumptionVsProduction ? (
                  <Typography variant="body1">
                    Klo {formatHour(data.hourWithMostConsumptionVsProduction.starttime)} — kulutus{" "}
                    {formatEnergy(data.hourWithMostConsumptionVsProduction.consumptionMwh, "MWh")},
                    tuotanto{" "}
                    {formatEnergy(data.hourWithMostConsumptionVsProduction.productionMwh, "MWh")}
                  </Typography>
                ) : (
                  <Typography color="text.disabled">Ei dataa</Typography>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, flex: "1 1 320px" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Halvimmat tunnit
                </Typography>
                {data.cheapestHours.length > 0 ? (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {data.cheapestHours.map((h) => (
                      <Chip
                        key={h.starttime}
                        label={`${formatHour(h.starttime)} · ${formatPrice(h.hourlyprice)}`}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.disabled">Ei dataa</Typography>
                )}
              </Paper>
            </Stack>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tuotanto ja kulutus tunneittain (MWh)
              </Typography>
              <Box sx={{ width: "100%", height: 320 }}>
                <LineChart
                  height={320}
                  xAxis={[{ data: data.hours.map((h) => formatHour(h.starttime)), scaleType: "point" }]}
                  series={[
                    {
                      label: "Tuotanto",
                      data: data.hours.map((h) => h.productionamount),
                      color: "#0F6E8C",
                    },
                    {
                      label: "Kulutus",
                      // consumptionamount is kWh — converted to MWh to match production's scale.
                      data: data.hours.map((h) =>
                        h.consumptionamount == null ? null : h.consumptionamount / 1000,
                      ),
                      color: "#E8A23D",
                    },
                  ]}
                  margin={{ left: 70 }}
                />
              </Box>
            </Paper>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
