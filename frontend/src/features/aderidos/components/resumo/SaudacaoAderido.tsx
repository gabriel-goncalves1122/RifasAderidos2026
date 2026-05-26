// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/SaudacaoAderido.tsx
// ============================================================================
import { Box, Typography } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";

interface SaudacaoAderidoProps {
  primeiroNome: string;
}

export function SaudacaoAderido({ primeiroNome }: SaudacaoAderidoProps) {
  const nomeSeguro = primeiroNome?.trim() || "Aderido";

  return (
    <Box>
      <Typography component="h2" sx={painelAderidoStyles.saudacaoTitulo}>
        Olá, {nomeSeguro}
      </Typography>

      {/* <Typography sx={painelAderidoStyles.saudacaoSubtitulo}>
        Acompanhe suas vendas, comprovantes e correções em um só lugar.
      </Typography> */}
    </Box>
  );
}
