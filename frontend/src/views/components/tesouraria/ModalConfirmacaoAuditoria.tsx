import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface Props {
  open: boolean;
  decisao: "aprovar" | "rejeitar" | null;
  quantidade: number;
  motivo: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ModalConfirmacaoAuditoria({ open, decisao, quantidade, motivo, onClose, onConfirm }: Props) {
  if (!decisao) return null;

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: decisao === "aprovar" ? "success.main" : "error.main" }}>
        {decisao === "aprovar" ? <CheckCircleIcon /> : <WarningAmberIcon />} Confirmar {decisao === "aprovar" ? "Aprovação" : "Rejeição"}
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          Você está prestes a <strong>{decisao}</strong> o pagamento de {quantidade} rifa(s).
        </DialogContentText>
        
        {motivo && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 1, borderLeft: "4px solid red" }}>
            <Typography variant="caption" color="text.secondary">Motivo que será enviado:</Typography>
            <Typography variant="body2" fontStyle="italic">"{motivo}"</Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ pb: 2, pr: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color={decisao === "aprovar" ? "success" : "error"}>
          Sim, {decisao}
        </Button>
      </DialogActions>
    </Dialog>
  );
}