import { useMemo, useState } from "react";
import { Alert, Box, Paper } from "@mui/material";
import { DataGrid, type GridRowParams } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchDailyStats, type DayStats } from "./api";
import { dayColumns } from "./columns";
import { SingleDayDialog } from "./SingleDayDialog";

// Daily stats page component, uses the columns configuration and MUI DataGrid with built-in sorting and pagination

export function DailyStatsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["daily-stats"],
    queryFn: fetchDailyStats,
  });

  const initialState = useMemo(
    () => ({
      sorting: { sortModel: [{ field: "date", sort: "asc" as const }] },
      pagination: { paginationModel: { pageSize: 25 } },
    }),
    [],
  );

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {(error as Error).message}
      </Alert>
    );
  }

  return (
    <Paper variant="outlined" sx={{ mt: 2 }}>
      <Box sx={{ height: 720 }}>
        <DataGrid
          rows={data ?? []}
          columns={dayColumns}
          getRowId={(row) => row.date}
          loading={isLoading}
          showToolbar
          initialState={initialState}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={(params: GridRowParams<DayStats>) => setSelectedDate(params.row.date)}
          sx={{
            border: "none",
            "& .MuiDataGrid-row": { cursor: "pointer" },
            "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
          }}
        />
      </Box>

      <SingleDayDialog date={selectedDate} onClose={() => setSelectedDate(null)} />
    </Paper>
  );
}
