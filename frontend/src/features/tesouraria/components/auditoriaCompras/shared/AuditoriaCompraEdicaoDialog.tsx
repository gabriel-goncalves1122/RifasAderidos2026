import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { CompraAuditavel } from "../../../types/auditoriaCompras";

interface AuditoriaCompraEdicaoDialogProps {
  compra: CompraAuditavel | null;
  onClose: () => void;
}

export function AuditoriaCompraEdicaoDialog({
  compra,
  onClose,
}: AuditoriaCompraEdicaoDialogProps) {
  return (
    <Dialog
      open={Boolean(compra)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
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
        Editar dados do comprador
        <Typography sx={{ color: "#526760", fontSize: "0.88rem", mt: 0.45 }}>
          Preparado para alterar apenas dados de contato, sem tocar nos vínculos.
        </Typography>
      </DialogTitle>
      {compra && (
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                bgcolor: "#EAF3EF",
                border: "1px solid rgba(6, 61, 49, 0.12)",
              }}
            >
              <Typography sx={{ color: "#063D31", fontWeight: 900 }}>
                Dados editáveis
              </Typography>
              <Typography sx={{ color: "#526760", fontSize: "0.88rem", mt: 0.5 }}>
                Apenas nome, e-mail e telefone poderão ser enviados ao backend na
                próxima integração.
              </Typography>
            </Paper>

            <TextField
              label="Nome do comprador"
              defaultValue={compra.comprador_nome}
              size="small"
              fullWidth
            />
            <TextField
              label="E-mail do comprador"
              defaultValue={compra.comprador_email}
              size="small"
              fullWidth
            />
            <TextField
              label="Telefone do comprador"
              defaultValue={compra.comprador_telefone}
              size="small"
              fullWidth
            />

            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2.5,
                bgcolor: "#FFF7E0",
                border: "1px solid rgba(107, 78, 0, 0.18)",
              }}
            >
              <Typography sx={{ color: "#6B4E00", fontWeight: 900 }}>
                Campos bloqueados
              </Typography>
              <Typography sx={{ color: "#526760", fontSize: "0.88rem", mt: 0.5 }}>
                {`Rifas: ${compra.bilhetes.join(", ")} | Vendedor: ${
                  compra.vendedor_nome
                } | Comprador ID: ${compra.comprador_id || "sem id"}`}
              </Typography>
            </Paper>
          </Stack>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FAFCFB" }}>
        <Button
          onClick={onClose}
          sx={{ color: "#063D31", fontWeight: 850, textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          disabled
          sx={{
            borderRadius: 2.5,
            fontWeight: 850,
            textTransform: "none",
          }}
        >
          Salvar alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
}
