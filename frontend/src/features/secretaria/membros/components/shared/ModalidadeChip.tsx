// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/ModalidadeChip.tsx
// ============================================================================
import { Chip } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";

export type ModalidadeAdesao = "completo" | "meio";

interface ModalidadeChipProps {
  modalidade?: ModalidadeAdesao | null;
}

export function ModalidadeChip({ modalidade }: ModalidadeChipProps) {
  // Registros antigos sem modalidade são tratados como aderidos completos.
  const modalidadeNormalizada = modalidade || "completo";
  const isMeioAderido = modalidadeNormalizada === "meio";

  return (
    <Chip
      size="small"
      icon={isMeioAderido ? <PersonIcon /> : <GroupsIcon />}
      label={isMeioAderido ? "Meio-aderido" : "Aderido"}
      color={isMeioAderido ? "warning" : "primary"}
      variant={isMeioAderido ? "filled" : "outlined"}
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
