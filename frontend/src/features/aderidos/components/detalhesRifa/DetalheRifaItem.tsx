// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/detalhesRifa/DetalheRifaItem.tsx
// ============================================================================
import { Box, Typography } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";

interface DetalheRifaItemProps {
  label: string;
  value?: string | null;
}

export function DetalheRifaItem({ label, value }: DetalheRifaItemProps) {
  return (
    <Box sx={painelAderidoStyles.detalheInfoItem}>
      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        {label}
      </Typography>

      <Typography variant="body1" color="text.primary" fontWeight={600}>
        {value || "Não informado"}
      </Typography>
    </Box>
  );
}
