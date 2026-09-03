// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/LoadingRifasState.tsx
// ============================================================================
import { Box, CircularProgress, Typography } from "@mui/material";

import { painelAderidoStyles } from "../styles/painelAderidoStyles";

export function LoadingRifasState() {
  return (
    <Box sx={painelAderidoStyles.loadingContainer}>
      <CircularProgress color="primary" />

      <Typography sx={{ mt: 2 }} color="text.secondary">
        Carregando suas rifas...
      </Typography>
    </Box>
  );
}
