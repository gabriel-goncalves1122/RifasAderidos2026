// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/ModalDetalhesRifa.tsx
// ============================================================================
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

interface ModalDetalhesRifaProps {
  open: boolean;
  onClose: () => void;
  rifa: any | null; // Recebe o objeto completo da rifa
}

export function ModalDetalhesRifa({ open, onClose, rifa }: ModalDetalhesRifaProps) {
  if (!rifa) return null;

  // Formata a data para o padrão PT-BR
  const dataFormatada = rifa.data_reserva
    ? new Date(rifa.data_reserva).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data não registada";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: "success.main" }}>
        Detalhes da Rifa #{rifa.numero}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Typography variant="body1" fontWeight="bold" color="success.main">
              Aprovada (Paga)
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Comprador</Typography>
            <Typography variant="body1">{rifa.comprador_nome || "Não informado"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Telefone</Typography>
            <Typography variant="body1">{rifa.comprador_telefone || "Não informado"}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">E-mail</Typography>
            <Typography variant="body1">{rifa.comprador_email || "Não informado"}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="caption" color="text.secondary">Data da Reserva</Typography>
            <Typography variant="body1">{dataFormatada}</Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}