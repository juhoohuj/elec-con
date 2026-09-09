import { Tooltip, Typography } from "@mui/material";

export function NoDataCell({ reason }: { reason: string }) {
  return (
    <Tooltip title={reason} arrow>
      <Typography component="span" variant="body2" sx={{ color: "text.disabled", fontStyle: "italic" }}>
        Ei dataa
      </Typography>
    </Tooltip>
  );
}
