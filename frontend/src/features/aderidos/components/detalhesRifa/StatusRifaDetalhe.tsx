// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/detalhesRifa/StatusRifaDetalhe.tsx
// ============================================================================
import { Box, Chip } from "@mui/material";
import { STATUS_RIFA_CONFIG } from "../../utils/rifasStatus";
import { RifaAderido } from "../../types/painelAderido";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface StatusRifaDetalheProps {
  status: RifaAderido["status"];
}

export function StatusRifaDetalhe({ status }: StatusRifaDetalheProps) {
  const config = STATUS_RIFA_CONFIG[status] || STATUS_RIFA_CONFIG["disponivel"];

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Chip
        icon={<InfoOutlinedIcon style={{ color: config.color, fontSize: 16 }} />}
        label={config.label}
        sx={{
          bgcolor: config.bg,
          color: config.color,
          fontWeight: 800,
          border: `1px solid ${config.borderColor || config.color}40`,
          borderRadius: 1.5,
          "& .MuiChip-label": {
            px: 1.5,
          },
        }}
      />
    </Box>
  );
}
