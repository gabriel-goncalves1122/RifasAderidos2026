// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/detalhesRifa/StatusRifaDetalhe.tsx
// ============================================================================
import { Box, Typography } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";

export function StatusRifaDetalhe() {
  return (
    <Box sx={painelAderidoStyles.detalheStatusBox}>
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        Status
      </Typography>

      <Typography variant="body1" fontWeight={850} color="success.dark">
        Aprovada pela tesouraria
      </Typography>
    </Box>
  );
}
