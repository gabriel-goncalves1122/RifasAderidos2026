// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/BlocoVendasHeader.tsx
// ============================================================================
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";

import { painelAderidoStyles } from "../styles/painelAderidoStyles";

interface BlocoVendasHeaderProps {
  totalRifasVisiveis?: number;
}

export function BlocoVendasHeader({ totalRifasVisiveis }: BlocoVendasHeaderProps) {
  return (
    <Box sx={painelAderidoStyles.blocoVendasHeader}>
      <Box sx={painelAderidoStyles.blocoVendasTituloLinha}>
        <Typography sx={painelAderidoStyles.blocoVendasTitulo}>
          Suas rifas
        </Typography>

        {typeof totalRifasVisiveis === "number" && (
          <Chip
            label={`${totalRifasVisiveis} na lista`}
            size="small"
            sx={painelAderidoStyles.blocoVendasContador}
          />
        )}

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
