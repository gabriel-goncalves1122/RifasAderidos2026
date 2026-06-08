// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/CardPendenciasAderido.tsx
// ============================================================================
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Button } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";
import { ResumoCard } from "./ResumoCard";

interface CardPendenciasAderidoProps {
  totalPendencias: number;
  onAbrirRecusadas: () => void;
}

export function CardPendenciasAderido({
  totalPendencias,
  onAbrirRecusadas,
}: CardPendenciasAderidoProps) {
  const possuiPendencias = totalPendencias > 0;

  const textoPendencia =
    totalPendencias === 1
      ? "1 correção aberta"
      : `${totalPendencias} correções abertas`;
  const acaoPendencia = possuiPendencias ? (
    <Button
      variant="outlined"
      size="small"
      onClick={onAbrirRecusadas}
      sx={painelAderidoStyles.pendenciaBotao}
    >
      Revisar
    </Button>
  ) : undefined;

  return (
    <ResumoCard
      icon={
        possuiPendencias ? (
          <ErrorOutlineIcon fontSize="small" />
        ) : (
          <TaskAltIcon fontSize="small" />
        )
      }
      label="Pendências"
      valor={possuiPendencias ? totalPendencias : 0}
      descricao={possuiPendencias ? textoPendencia : "Tudo certo agora."}
      acao={acaoPendencia}
      variant={possuiPendencias ? "alert" : "success"}
    />
  );
}
