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
      ? "1 correção aberta"
      : `${totalPendencias} correções abertas`;

  return (
    <Box sx={painelAderidoStyles.resumoCompactoItem}>
      <Stack sx={painelAderidoStyles.resumoMetaLinha}>
        <Box
          sx={{
            ...painelAderidoStyles.resumoIconBox,
            ...(possuiPendencias
              ? painelAderidoStyles.resumoIconBoxAlerta
              : painelAderidoStyles.resumoIconBoxOk),
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

      <Box sx={painelAderidoStyles.resumoConteudoLinha}>
        <Typography
          sx={{
            ...painelAderidoStyles.resumoCardValor,
            color: possuiPendencias ? "#6B4A00" : "#063D31",
          }}
        >
          {possuiPendencias ? totalPendencias : 0}
        </Typography>

        <Typography sx={painelAderidoStyles.resumoCardDescricao}>
          {possuiPendencias ? textoPendencia : "Tudo certo agora."}
        </Typography>

        {possuiPendencias && (
          <Button
            variant="outlined"
            size="small"
            onClick={onAbrirRecusadas}
            sx={painelAderidoStyles.pendenciaBotao}
          >
            Revisar
          </Button>
        )}
      </Box>
    </Box>
  );
}
