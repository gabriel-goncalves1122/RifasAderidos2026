// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/EstatisticasAderido.tsx
// ============================================================================
import { Box, Paper } from "@mui/material";

import { painelAderidoStyles } from "./styles/painelAderidoStyles";
import { CardArrecadacao } from "./components/resumo/CardArrecadacao";
import { CardPendenciasAderido } from "./components/resumo/CardPendenciasAderido";
import { HeaderAderido } from "./components/resumo/HeaderAderido";

interface EstatisticasAderidoProps {
  primeiroNome: string;
  valorArrecadado: number;
  notificacoesNaoLidas: number;
  totalPendencias: number;
  onAbrirNotificacoes: () => void;
  onAbrirRecusadas: () => void;
}

export function EstatisticasAderido({
  primeiroNome,
  valorArrecadado,
  notificacoesNaoLidas,
  totalPendencias,
  onAbrirNotificacoes,
  onAbrirRecusadas,
}: EstatisticasAderidoProps) {
  return (
    <Box sx={painelAderidoStyles.resumoContainer}>
      <HeaderAderido
        primeiroNome={primeiroNome}
        notificacoesNaoLidas={notificacoesNaoLidas}
        onAbrirNotificacoes={onAbrirNotificacoes}
      />

      <Paper elevation={0} sx={painelAderidoStyles.resumoCompactoCard}>
        <CardArrecadacao valorArrecadado={valorArrecadado} />

        <Box sx={painelAderidoStyles.resumoDivisor} />

        <CardPendenciasAderido
          totalPendencias={totalPendencias}
          onAbrirRecusadas={onAbrirRecusadas}
        />
      </Paper>
    </Box>
  );
}
