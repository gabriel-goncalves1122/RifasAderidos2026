import { Alert } from "@mui/material";

import { auditoriaCardStyles } from "../../auditoriaCardStyles";
import { EstadoAuditoriaIA } from "../../auditoriaTypes";

interface AuditoriaIaAlertProps {
  estadoIA: EstadoAuditoriaIA;
}

export function AuditoriaIaAlert({ estadoIA }: AuditoriaIaAlertProps) {
  if (!estadoIA.mensagem) return null;

  return (
    <Alert
      severity={estadoIA.aprovada ? "success" : "warning"}
      sx={{
        ...auditoriaCardStyles.alertaIa,
        ...(estadoIA.divergente ? auditoriaCardStyles.alertaIaDivergente : {}),
      }}
    >
      <strong>Relatório OCR:</strong> {estadoIA.mensagem}
    </Alert>
  );
}
