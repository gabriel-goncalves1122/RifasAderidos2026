import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <Box
    sx={{
      minHeight: 260,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      px: 2,
      py: 4,
      borderRadius: 2,
      border: "1px dashed rgba(6, 61, 49, 0.18)",
      bgcolor: "rgba(255, 255, 255, 0.72)",
    }}
  >
    <Box sx={{ fontSize: 56, color: "text.disabled", mb: 1.5 }}>
      {icon}
    </Box>
    <Typography color="text.secondary" variant="h6">
      {title}
    </Typography>
    {description && (
      <Typography color="text.disabled" variant="body2" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    )}
    {action && <Box sx={{ mt: 2 }}>{action}</Box>}
  </Box>
);
