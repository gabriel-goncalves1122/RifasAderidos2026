// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/CardPendenciasAderido.tsx
// ============================================================================
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Box, Button, Stack, Typography } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";

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
      ? "1 correção pendente"
      : `${totalPendencias} correções pendentes`;

  return (
    <Box sx={painelAderidoStyles.resumoCompactoItem}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            ...painelAderidoStyles.resumoIconBox,
            color: possuiPendencias ? "#8A2A2A" : "#0B5136",
            bgcolor: possuiPendencias ? "#FBEAEA" : "#EAF7EF",
          }}
        >
          {possuiPendencias ? (
            <ErrorOutlineIcon fontSize="small" />
          ) : (
            <TaskAltIcon fontSize="small" />
          )}
        </Box>

        <Typography sx={painelAderidoStyles.resumoCardLabel}>
          Pendências
        </Typography>
      </Stack>

      <Typography
        sx={{
          ...painelAderidoStyles.resumoCardValor,
          color: possuiPendencias ? "#8A2A2A" : "#052E23",
        }}
      >
        {possuiPendencias ? totalPendencias : 0}
      </Typography>

      <Typography sx={painelAderidoStyles.resumoCardDescricao}>
        {possuiPendencias ? textoPendencia : "Nenhuma correção no momento."}
      </Typography>

      {possuiPendencias && (
        <Button
          variant="outlined"
          size="small"
          onClick={onAbrirRecusadas}
          sx={painelAderidoStyles.pendenciaBotao}
        >
          Corrigir
        </Button>
      )}
    </Box>
  );
}
