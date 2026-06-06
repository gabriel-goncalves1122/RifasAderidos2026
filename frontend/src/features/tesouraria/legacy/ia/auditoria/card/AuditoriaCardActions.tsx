import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, CircularProgress } from "@mui/material";

import { auditoriaCardStyles } from "../../auditoriaCardStyles";

interface AuditoriaCardActionsProps {
  possuiComprovante: boolean;
  isProcessando: boolean;
  recusaAberta: boolean;
  onVerPix: () => void;
  onAprovar: () => void;
  onRejeitar: () => void;
}

export function AuditoriaCardActions({
  possuiComprovante,
  isProcessando,
  recusaAberta,
  onVerPix,
  onAprovar,
  onRejeitar,
}: AuditoriaCardActionsProps) {
  return (
    <Box sx={auditoriaCardStyles.actionsLinha}>
      <Button
        variant="outlined"
        size="small"
        disabled={!possuiComprovante}
        onClick={onVerPix}
        startIcon={<VisibilityIcon />}
        sx={auditoriaCardStyles.botaoSecundario}
      >
        Ver comprovante
      </Button>

      <Box sx={auditoriaCardStyles.grupoAcoes}>
        {!recusaAberta && (
          <Button
            variant="contained"
            size="small"
            disabled={isProcessando}
            onClick={onAprovar}
            startIcon={
              isProcessando ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckCircleIcon />
              )
            }
            sx={auditoriaCardStyles.botaoPrimario}
          >
            Aprovar pagamento
          </Button>
        )}

        <Button
          variant={recusaAberta ? "contained" : "outlined"}
          color="error"
          size="small"
          disabled={isProcessando}
          onClick={onRejeitar}
          startIcon={recusaAberta ? <SendIcon /> : <CancelIcon />}
          sx={auditoriaCardStyles.botaoPerigo}
        >
          {recusaAberta ? "Confirmar recusa" : "Reprovar"}
        </Button>
      </Box>
    </Box>
  );
}
