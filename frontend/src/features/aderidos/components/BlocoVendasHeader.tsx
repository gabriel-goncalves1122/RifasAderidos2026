// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/BlocoVendasHeader.tsx
// ============================================================================
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import { painelAderidoStyles } from "../styles/painelAderidoStyles";

export function BlocoVendasHeader() {
  return (
    <Box sx={painelAderidoStyles.blocoVendasHeader}>
      <Box sx={painelAderidoStyles.blocoVendasTituloLinha}>
        <Typography sx={painelAderidoStyles.blocoVendasTitulo}>
          Suas rifas
        </Typography>

        <Tooltip title="Toque nas rifas disponíveis para selecionar. Rifas pagas podem ser abertas para consulta.">
          <IconButton size="small" sx={{ color: "#0B2F24" }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/*   <Typography sx={painelAderidoStyles.blocoVendasDescricao}>
        Selecione os números disponíveis para registrar uma venda. Use os
        filtros para encontrar rifas por situação.
      </Typography> */}
    </Box>
  );
}
