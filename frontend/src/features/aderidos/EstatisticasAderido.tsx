// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/EstatisticasAderido.tsx
// ============================================================================
import { Box, Paper } from "@mui/material";

import { painelAderidoStyles } from "./styles/painelAderidoStyles";
import { BotaoNotificacoes } from "./components/resumo/BotaoNotificacoes";
import { CardArrecadacao } from "./components/resumo/CardArrecadacao";
import { CardPendenciasAderido } from "./components/resumo/CardPendenciasAderido";
import { SaudacaoAderido } from "./components/resumo/SaudacaoAderido";

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
      <Box sx={painelAderidoStyles.resumoHeader}>
        <SaudacaoAderido primeiroNome={primeiroNome} />

        <BotaoNotificacoes
          notificacoesNaoLidas={notificacoesNaoLidas}
          onAbrirNotificacoes={onAbrirNotificacoes}
        />
      </Box>

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
