import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { TransacaoTesouraria } from "../../../types/auditoriaCompras";
import { colors } from "@/shared/tokens/colors";
import { typographyScale as typography } from "@/shared/tokens/typography";
import { components } from "@/shared/tokens/components";

interface NotificarCorrecaoDialogProps {
  aberto: boolean;
  compra: TransacaoTesouraria | null;
  notificando: boolean;
  onClose: () => void;
  onSubmit: (mensagem: string) => void;
}

export function NotificarCorrecaoDialog({
  aberto,
  compra,
  notificando,
  onClose,
  onSubmit,
}: NotificarCorrecaoDialogProps) {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensagem.trim().length < 5) {
      setErro("A mensagem deve ter pelo menos 5 caracteres.");
      return;
    }
    onSubmit(mensagem);
  };

  const handleClose = () => {
    if (notificando) return;
    setMensagem("");
    setErro("");
    onClose();
  };

  if (!compra) return null;

  return (
    <Dialog
      open={aberto}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 24px 48px rgba(2, 27, 22, 0.15)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={0.5}>
            <Typography sx={typography.h2}>Solicitar Correção de Dados</Typography>
            <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.88rem" }}>
              Aderido: {compra.vendedorNome}
            </Typography>
          </Stack>

          <IconButton
            onClick={handleClose}
            disabled={notificando}
            sx={{ color: colors.cinzaDisabled }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, borderColor: colors.fundoEscuro }}>
          <Stack spacing={2.5}>
            <TextField
              label="O que precisa ser corrigido?"
              multiline
              rows={4}
              fullWidth
              value={mensagem}
              onChange={(e) => {
                setMensagem(e.target.value);
                if (erro) setErro("");
              }}
              error={Boolean(erro)}
              helperText={erro || "Esta mensagem aparecerá na tela do aderido."}
              disabled={notificando}
              InputProps={{
                sx: { borderRadius: 2, bgcolor: colors.fundoSuave },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            disabled={notificando}
            sx={{
              color: colors.cinzaTexto,
              fontWeight: 750,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={notificando}
            startIcon={<ReplyOutlinedIcon />}
            sx={{
              ...components.botaoPrimario,
              px: 3,
            }}
          >
            {notificando ? "Enviando..." : "Devolver para Aderido"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
