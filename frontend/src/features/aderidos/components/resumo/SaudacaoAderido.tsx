// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/SaudacaoAderido.tsx
// ============================================================================
import { Box, Typography } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";

interface SaudacaoAderidoProps {
  primeiroNome: string;
}

export function SaudacaoAderido({ primeiroNome }: SaudacaoAderidoProps) {
  const nome = primeiroNome?.trim();
  const nomeSeguro = nome && nome.toLowerCase() !== "aderido" ? nome : "";

  return (
    <Box>
      <Typography component="h2" sx={painelAderidoStyles.saudacaoTitulo}>
        {nomeSeguro ? `Olá, ${nomeSeguro}` : "Olá"}
      </Typography>

      {/* <Typography sx={painelAderidoStyles.saudacaoSubtitulo}>
        Acompanhe suas vendas, comprovantes e correções em um só lugar.
      </Typography> */}
    </Box>
  );
}
