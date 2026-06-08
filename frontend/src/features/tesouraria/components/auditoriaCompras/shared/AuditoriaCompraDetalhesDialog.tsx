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
        sx: {
          borderRadius: 2.25,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#021B16",
          fontWeight: 950,
          pb: 1,
          borderBottom: "1px solid rgba(2, 27, 22, 0.08)",
        }}
      >
        Detalhes da compra
        <Typography sx={{ color: "#526760", fontSize: "0.88rem", mt: 0.45 }}>
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
                  sx={{
                    bgcolor: "#EAF3EF",
                    color: "#063D31",
                    fontWeight: 850,
                  }}
                />
              ))}
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 1,
              }}
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
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FAFCFB" }}>
        <Button
          onClick={onClose}
          sx={{ color: "#063D31", fontWeight: 850, textTransform: "none" }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
