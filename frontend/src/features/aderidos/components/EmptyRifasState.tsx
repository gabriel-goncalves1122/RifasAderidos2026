// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/EmptyRifasState.tsx
// ============================================================================
import { Box, Typography } from "@mui/material";

import { painelAderidoStyles } from "../styles/painelAderidoStyles";

export function EmptyRifasState() {
  return (
    <Box sx={painelAderidoStyles.emptyState}>
      <Typography fontWeight={800} color="text.primary">
        Nenhuma rifa encontrada
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 0.75 }}>
        Ajuste o filtro para visualizar outras categorias.
      </Typography>
    </Box>
  );
}
