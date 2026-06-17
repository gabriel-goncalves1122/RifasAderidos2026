// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/ModalDetalhesRifa.tsx
// ============================================================================
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
} from "@mui/material";

import { painelAderidoStyles } from "./styles/painelAderidoStyles";
import { RifaAderido } from "./types/painelAderido";
import { formatarData } from "@/shared/utils/formatadores";
import { DetalheRifaItem } from "./components/detalhesRifa/DetalheRifaItem";
import { StatusRifaDetalhe } from "./components/detalhesRifa/StatusRifaDetalhe";

interface ModalDetalhesRifaProps {
  open: boolean;
  onClose: () => void;
  rifa: RifaAderido | null;
}

export function ModalDetalhesRifa({
  open,
  onClose,
  rifa,
}: ModalDetalhesRifaProps) {
  if (!rifa) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: painelAderidoStyles.detalheDialogPaper,
      }}
    >
      <DialogTitle sx={painelAderidoStyles.detalheDialogTitle}>
        Rifa #{rifa.numero}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <StatusRifaDetalhe />

          <DetalheRifaItem label="Comprador" value={rifa.comprador_nome} />
          <DetalheRifaItem label="Telefone" value={rifa.comprador_telefone} />
          <DetalheRifaItem label="E-mail" value={rifa.comprador_email} />

          <Divider />

          <DetalheRifaItem
            label="Data da reserva"
            value={formatarData(rifa.data_reserva)}
          />

          <DetalheRifaItem
            label="Data de aprovação"
            value={formatarData(rifa.data_pagamento)}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            "&:focus-visible": {
              outline: "4px solid rgba(6, 61, 49, 0.24)",
              outlineOffset: "2px",
            },
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
