// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/CargoChip.tsx
// ============================================================================
import { Chip } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";

// Importamos o dicionário oficial que criámos
import { CARGOS_COMISSAO } from "../../../types/constants";

interface Props {
  cargo?: string | null;
}

export function CargoChip({ cargo }: Props) {
  if (!cargo || cargo === "aderido") {
    return null;
  }

  // 1. Procurar o nome EXATO (label) no dicionário de constantes
  const cargoOficial = CARGOS_COMISSAO.find((c) => c.id === cargo);
  const labelOficial = cargoOficial ? cargoOficial.label : cargo.toUpperCase();

  // 2. Cores e Ícones base
  let bgcolor = "#616161";
  let icon = <WorkIcon fontSize="small" />;

  // 3. Lógica de Cores Familiares
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
      label={labelOficial}
      sx={{
        bgcolor: bgcolor,
        color: "white",
        fontWeight: "bold",
        height: 28, // Garante que a altura da caixa é rigorosamente igual para todos
        "& .MuiChip-label": {
          whiteSpace: "nowrap", // MÁGICA: Impede que o texto quebre para a linha de baixo
          overflow: "hidden",
          textOverflow: "ellipsis", // Se a tela do telemóvel for muito pequena, mete "..." em vez de quebrar a caixa
          fontSize: "0.75rem", // Tamanho de letra padronizado para todas as etiquetas
          px: 1.5, // Espaçamento interno horizontal idêntico
        },
      }}
    />
  );
}
