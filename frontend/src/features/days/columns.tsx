import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { DayStats } from "./api";
import { formatDate, formatEnergy, formatPrice } from "./format";
import { NoDataCell } from "./NoDataCell";
import { displayTextOperators, fiFiNumericOperators, quickFilterOnFormattedText } from "./filtering";

// Column configuration for the daily stats table

function missingDataReason(row: DayStats): string {
  return row.isIncompleteDay
    ? `Päivältä on kirjattu vain ${row.hoursRecorded}/24 tuntia, joten päivän kokonaislukuja ei lasketa vajaan datan pohjalta.`
    : "Kulutusdataa ei ole saatavilla tälle päivälle (kulutuksen seuranta tässä aineistossa alkaa 1.8.2023).";
}

export const dayColumns: GridColDef<DayStats>[] = [
  {
    field: "date",
    headerName: "Päivä",
    width: 170,
    getApplyQuickFilterFn: quickFilterOnFormattedText((row) => formatDate(row.date)),
    filterOperators: displayTextOperators((row) => formatDate(row.date)),
    renderCell: (params: GridRenderCellParams<DayStats, string>) => (
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", height: "100%" }}>
        <Typography variant="body2">{formatDate(params.row.date)}</Typography>
        {params.row.isIncompleteDay && (
          <Tooltip title={`Vain ${params.row.hoursRecorded}/24 tuntia kirjattu tälle päivälle`} arrow>
            <Chip label="Vajaa" size="small" color="warning" variant="outlined" />
          </Tooltip>
        )}
      </Stack>
    ),
  },
  {
    field: "totalConsumptionKwh",
    headerName: "Kulutus yhteensä",
    width: 170,
    align: "right",
    headerAlign: "right",
    getApplyQuickFilterFn: quickFilterOnFormattedText((row) =>
      row.totalConsumptionKwh == null ? "" : formatEnergy(row.totalConsumptionKwh, "kWh"),
    ),
    filterOperators: fiFiNumericOperators,
    renderCell: (params: GridRenderCellParams<DayStats, number | null>) =>
      params.value == null ? (
        <NoDataCell reason={missingDataReason(params.row)} />
      ) : (
        formatEnergy(params.value, "kWh")
      ),
  },
  {
    field: "totalProductionMwh",
    headerName: "Tuotanto yhteensä",
    width: 170,
    align: "right",
    headerAlign: "right",
    getApplyQuickFilterFn: quickFilterOnFormattedText((row) =>
      row.totalProductionMwh == null ? "" : formatEnergy(row.totalProductionMwh, "MWh"),
    ),
    filterOperators: fiFiNumericOperators,
    renderCell: (params: GridRenderCellParams<DayStats, number | null>) =>
      params.value == null ? (
        <NoDataCell reason={missingDataReason(params.row)} />
      ) : (
        formatEnergy(params.value, "MWh")
      ),
  },
  {
    field: "averagePriceEurPerMwh",
    headerName: "Keskihinta",
    width: 150,
    align: "right",
    headerAlign: "right",
    getApplyQuickFilterFn: quickFilterOnFormattedText((row) =>
      row.averagePriceEurPerMwh == null ? "" : formatPrice(row.averagePriceEurPerMwh),
    ),
    filterOperators: fiFiNumericOperators,
    renderCell: (params: GridRenderCellParams<DayStats, number | null>) => {
      if (params.value == null) return <NoDataCell reason={missingDataReason(params.row)} />;
      const isNegative = params.value < 0;
      return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
          <Typography
            variant="body2"
            sx={{ color: isNegative ? "secondary.dark" : "text.primary", fontWeight: isNegative ? 600 : 400 }}
          >
            {formatPrice(params.value)}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "longestNegativePriceStreakHours",
    headerName: "Pisin negatiivinen jakso",
    width: 210,
    align: "right",
    headerAlign: "right",
    getApplyQuickFilterFn: quickFilterOnFormattedText(
      (row) => `${row.longestNegativePriceStreakHours} h`,
    ),
    filterOperators: fiFiNumericOperators,
    renderCell: (params: GridRenderCellParams<DayStats, number>) => (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
        <Typography
          variant="body2"
          sx={{ color: params.value ? "secondary.dark" : "text.disabled", fontWeight: params.value ? 600 : 400 }}
        >
          {params.value ?? 0} h
        </Typography>
      </Box>
    ),
  },
  {
    field: "__viewDetails",
    headerName: "",
    width: 44,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    hideable: false,
    align: "center",
    renderCell: () => (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <ChevronRightIcon fontSize="small" sx={{ color: "text.disabled" }} />
      </Box>
    ),
  },
];
