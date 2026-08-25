import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { TransacaoTesouraria } from "../../../types/auditoriaCompras";
import {
  formatarDataAuditoria,
  statusLabelAuditoria,
} from "../../../utils/auditoriaComprasUtils";
import { colors } from "@/shared/tokens/colors";
import { surfaces } from "@/shared/tokens/surfaces";
import { components } from "@/shared/tokens/components";
import { layout } from "../../../styles/layout";

interface AuditoriaCompraDetalhesDialogProps {
  compra: TransacaoTesouraria | null;
  onClose: () => void;
}

export function AuditoriaCompraDetalhesDialog({
  compra,
  onClose,
}: AuditoriaCompraDetalhesDialogProps) {
  return (
    <Dialog
      open={Boolean(compra)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: surfaces.dialog,
      }}
    >
      <DialogTitle
        sx={surfaces.dialogTitle}
      >
        Detalhes da compra
        <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.88rem", mt: 0.45 }}>
          Conferência de vínculos, bilhetes e dados protegidos.
        </Typography>
      </DialogTitle>
      {compra && (
        <DialogContent sx={{ pt: 2.75 }}>
          <Stack spacing={2.25}>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {compra.bilhetes.map((bilhete) => (
                <Chip
                  key={bilhete}
                  label={`Rifa ${bilhete}`}
                  sx={components.chipBilhete}
                />
              ))}
            </Stack>

            <Box
              sx={layout.gridDois}
            >
              <TextField
                label="Comprador ID"
                value={compra.compradorId || "Sem compradorId"}
                size="small"
                disabled
              />
              <TextField
                label="Status"
                value={statusLabelAuditoria(compra.status)}
                size="small"
                disabled
              />
              <TextField
                label="Vendedor"
                value={compra.vendedorNome}
                size="small"
                disabled
              />
              <TextField
                label="CPF do vendedor"
                value={compra.vendedorCpf}
                size="small"
                disabled
              />
              <TextField
                label="Data da reserva"
                value={formatarDataAuditoria(compra.dataReserva)}
                size="small"
                disabled
              />
              <TextField
                label="Data do pagamento"
                value={formatarDataAuditoria(compra.dataPagamento)}
                size="small"
                disabled
              />
            </Box>
          </Stack>
        </DialogContent>
      )}
      <DialogActions sx={surfaces.dialogActions}>
        <Button
          onClick={onClose}
          sx={components.botaoSecundario}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
