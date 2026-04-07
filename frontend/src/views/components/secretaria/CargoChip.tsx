// ============================================================================
// ARQUIVO: frontend/src/views/components/CargoChip.tsx
// ============================================================================
import { Chip } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";

interface Props {
  cargo?: string | null;
}

export function CargoChip({ cargo }: Props) {
  if (cargo === "admin" || cargo === "presidencia") {
    return (
      <Chip
        size="small"
        icon={<ShieldIcon />}
        label="Administrador"
        sx={{ bgcolor: "#d32f2f", color: "white", fontWeight: "bold" }}
      />
    );
  }
  if (cargo === "tesouraria") {
    return (
      <Chip
        size="small"
        icon={<ShieldIcon />}
        label="Tesouraria"
        sx={{ bgcolor: "#1565c0", color: "white", fontWeight: "bold" }}
      />
    );
  }
  if (cargo === "secretaria") {
    return (
      <Chip
        size="small"
        icon={<ShieldIcon />}
        label="Secretaria"
        sx={{ bgcolor: "#ed6c02", color: "white", fontWeight: "bold" }}
      />
    );
  }
  return null;
}
