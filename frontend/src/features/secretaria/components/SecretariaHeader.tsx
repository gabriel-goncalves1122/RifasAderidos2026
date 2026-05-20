// ============================================================================
// ARQUIVO: frontend/src/views/components/SecretariaHeader.tsx
// ============================================================================
import { Box, Typography } from "@mui/material";

export function SecretariaHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold" color="primary.dark">
          Painel da Secretaria
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestão da lista oficial de aderidos e membros da comissão.
        </Typography>
      </Box>
    </Box>
  );
}
