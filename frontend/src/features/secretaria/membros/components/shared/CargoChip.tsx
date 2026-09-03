// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/CargoChip.tsx
// ============================================================================
import { Chip } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";

import { CARGOS_COMISSAO } from "../../../../../shared/types/constants";

interface CargoChipProps {
  cargo?: string | null;
}

export function CargoChip({ cargo }: CargoChipProps) {
  // Aderido comum não recebe chip de cargo para manter a tabela mais limpa.
  if (!cargo || cargo === "aderido") {
    return null;
  }

  const cargoOficial = CARGOS_COMISSAO.find((item) => item.id === cargo);
  const label = cargoOficial ? cargoOficial.label : cargo.toUpperCase();

  let bgcolor = "#616161";
  let icon = <WorkIcon fontSize="small" />;

  // Mantém cores previsíveis para cargos administrativos recorrentes.
  if (cargo.includes("admin")) {
    bgcolor = "#d32f2f";
    icon = <ShieldIcon fontSize="small" />;
  } else if (cargo.includes("presidencia")) {
    bgcolor = "#b71c1c";
    icon = <StarIcon fontSize="small" />;
  } else if (cargo.includes("tesouraria")) {
    bgcolor = "#1565c0";
  } else if (cargo.includes("secretaria")) {
    bgcolor = "#ed6c02";
  } else if (cargo.includes("eventos")) {
    bgcolor = "#9c27b0";
  } else if (cargo.includes("marketing") || cargo.includes("comunicacao")) {
    bgcolor = "#2e7d32";
  } else if (cargo.includes("rh")) {
    bgcolor = "#0288d1";
  }

  return (
    <Chip
      size="small"
      icon={icon}
      label={label}
      sx={{
        bgcolor,
        color: "white",
        fontWeight: "bold",
        height: 28,
        "& .MuiChip-icon": {
          color: "white",
        },
        "& .MuiChip-label": {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "0.75rem",
          px: 1.5,
        },
      }}
    />
  );
}
