import { useMemo } from "react";
import { Alert, Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchDailyStats } from "./api";
import { dayColumns } from "./columns";

// Daily stats page component, uses the columns configuration and MUI DataGrid with built-in sorting and pagination

export function DailyStatsPage() {
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
          sx={{ border: "none" }}
        />
      </Box>
    </Paper>
  );
}
