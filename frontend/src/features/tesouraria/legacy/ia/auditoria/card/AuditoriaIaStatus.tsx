import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Chip } from "@mui/material";

import { EstadoAuditoriaIA } from "../../auditoriaTypes";

interface AuditoriaIaStatusProps {
  estadoIA: EstadoAuditoriaIA;
}

export function AuditoriaIaStatus({ estadoIA }: AuditoriaIaStatusProps) {
  if (!estadoIA.possuiResultado) return null;

  return (
    <Chip
      icon={<SmartToyIcon />}
      label={estadoIA.aprovada ? "Pré-aprovado pela IA" : "Divergência detectada"}
      size="small"
      sx={{
        borderRadius: 2,
        fontWeight: 850,
        bgcolor: estadoIA.aprovada ? "#EAF3EF" : "#FFF7E0",
        color: estadoIA.aprovada ? "#063D31" : "#6B4E00",
        border: estadoIA.aprovada
          ? "1px solid rgba(6, 61, 49, 0.18)"
          : "1px solid rgba(143, 104, 0, 0.25)",
        "& .MuiChip-icon": {
          color: estadoIA.aprovada ? "#063D31" : "#6B4E00",
        },
      }}
    />
  );
}
