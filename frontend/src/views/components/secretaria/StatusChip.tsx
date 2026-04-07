// ============================================================================
// ARQUIVO: frontend/src/views/components/StatusChip.tsx
// ============================================================================
import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

interface Props {
  status: "ativo" | "pendente";
}

export function StatusChip({ status }: Props) {
  return status === "ativo" ? (
    <Chip
      size="small"
      color="success"
      variant="outlined"
      icon={<CheckCircleIcon />}
      label="Conta Ativa"
    />
  ) : (
    <Chip
      size="small"
      color="default"
      icon={<HourglassEmptyIcon />}
      label="Pendente / Só E-mail"
    />
  );
}
