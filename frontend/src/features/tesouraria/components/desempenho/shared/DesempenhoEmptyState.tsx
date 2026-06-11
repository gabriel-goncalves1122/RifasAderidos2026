import { Box, Typography } from "@mui/material";

import { colors } from "../../../styles/colors";

interface DesempenhoEmptyStateProps {
  mensagem: string;
  altura?: number;
}

export function DesempenhoEmptyState({
  mensagem,
  altura = 220,
}: DesempenhoEmptyStateProps) {
  return (
    <Box
      sx={{
        minHeight: altura,
        display: "grid",
        placeItems: "center",
        px: 2.5,
        textAlign: "center",
        bgcolor: colors.fundoSuave,
        border: "1px dashed rgba(6, 61, 49, 0.20)",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{
          color: colors.cinzaTexto,
          fontWeight: 850,
          fontStyle: "italic",
          lineHeight: 1.35,
          maxWidth: 260,
        }}
      >
        {mensagem}
      </Typography>
    </Box>
  );
}
