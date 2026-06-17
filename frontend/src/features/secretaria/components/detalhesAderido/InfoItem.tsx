// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/components/detalhesAderido/InfoItem.tsx
// ============================================================================
import { Box, Typography } from "@mui/material";

import { secretariaColors } from "../../styles/colors";

interface InfoItemProps {
  label: string;
  valor?: string | number | null;
}

export function InfoItem({ label, valor }: InfoItemProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: secretariaColors.fundoSuave,
        border: "1px solid",
        borderColor: secretariaColors.borda,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body2" fontWeight={600} sx={{ mt: 0.3 }}>
        {valor || "Não informado"}
      </Typography>
    </Box>
  );
}
