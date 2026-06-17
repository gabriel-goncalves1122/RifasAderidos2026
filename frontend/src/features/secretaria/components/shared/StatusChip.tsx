// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/StatusChip.tsx
// ============================================================================
import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BlockIcon from "@mui/icons-material/Block";

import { StatusCadastro } from "../../../shared/types/secretaria";

interface StatusChipProps {
  status: StatusCadastro;
}

export function StatusChip({ status }: StatusChipProps) {
  // Centraliza a apresentação visual dos status aceitos pela secretaria.
  if (status === "ativo") {
    return (
      <Chip
        size="small"
        color="success"
        variant="outlined"
        icon={<CheckCircleIcon />}
        label="Conta Ativa"
        sx={{
          height: 28,
          fontWeight: 600,
          "& .MuiChip-label": {
            fontSize: "0.75rem",
          },
        }}
      />
    );
  }

  if (status === "inativo") {
    return (
      <Chip
        size="small"
        color="error"
        variant="outlined"
        icon={<BlockIcon />}
        label="Inativo"
        sx={{
          height: 28,
          fontWeight: 600,
          "& .MuiChip-label": {
            fontSize: "0.75rem",
          },
        }}
      />
    );
  }

  return (
    <Chip
      size="small"
      color="default"
      variant="filled"
      icon={<HourglassEmptyIcon />}
      label="Pendente"
      sx={{
        height: 28,
        fontWeight: 600,
        "& .MuiChip-label": {
          fontSize: "0.75rem",
        },
      }}
    />
  );
}
