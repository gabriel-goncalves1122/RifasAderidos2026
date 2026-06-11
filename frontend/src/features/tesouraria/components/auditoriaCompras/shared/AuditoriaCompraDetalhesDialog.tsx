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

import { CompraAuditavel } from "../../../types/auditoriaCompras";
import {
  formatarDataAuditoria,
  statusLabelAuditoria,
} from "../../../utils/auditoriaComprasUtils";
import { colors } from "../../../styles/colors";
import { surfaces } from "../../../styles/surfaces";
import { components } from "../../../styles/components";
import { layout } from "../../../styles/layout";

interface AuditoriaCompraDetalhesDialogProps {
  compra: CompraAuditavel | null;
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
                value={compra.comprador_id || "Sem comprador_id"}
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
                value={compra.vendedor_nome}
                size="small"
                disabled
              />
              <TextField
                label="CPF do vendedor"
                value={compra.vendedor_cpf}
                size="small"
                disabled
              />
              <TextField
                label="Data da reserva"
                value={formatarDataAuditoria(compra.data_reserva)}
                size="small"
                disabled
              />
              <TextField
                label="Data do pagamento"
                value={formatarDataAuditoria(compra.data_pagamento)}
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
