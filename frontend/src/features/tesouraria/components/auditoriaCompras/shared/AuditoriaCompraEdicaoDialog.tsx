import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

import { CompraAuditavel } from "../../../types/auditoriaCompras";

interface AuditoriaCompraEdicaoDialogProps {
  compra: CompraAuditavel | null;
  salvando: boolean;
  erro?: string | null;
  onClose: () => void;
  onSalvar: (dados: {
    nome: string;
    email?: string | null;
    telefone?: string | null;
  }) => Promise<boolean>;
}

export function AuditoriaCompraEdicaoDialog({
  compra,
  salvando,
  erro,
  onClose,
  onSalvar,
}: AuditoriaCompraEdicaoDialogProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    setNome(compra?.comprador_nome || "");
    setEmail(compra?.comprador_email || "");
    setTelefone(compra?.comprador_telefone || "");
  }, [compra]);

  const nomeValido = nome.trim().length > 0;

  const salvarCampos = async () => {
    if (!nomeValido || salvando) return;

    await onSalvar({
      nome: nome.trim(),
      email: email.trim() || null,
      telefone: telefone.trim() || null,
    });
  };

  const salvar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await salvarCampos();
  };

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
        Editar dados do comprador
        <Typography sx={{ color: "#526760", fontSize: "0.88rem", mt: 0.45 }}>
          Preparado para alterar apenas dados de contato, sem tocar nos vínculos.
        </Typography>
      </DialogTitle>
      {compra && (
        <DialogContent
          component="form"
          id="auditoria-compra-edicao-form"
          onSubmit={salvar}
          sx={{ pt: 2.75 }}
        >
          <Stack spacing={2} sx={{ pt: 1 }}>
            {erro && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {erro}
              </Alert>
            )}

            <TextField
              label="Nome do comprador"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              size="small"
              fullWidth
              required
              error={!nomeValido}
              helperText={!nomeValido ? "Informe o nome do comprador." : " "}
              disabled={salvando}
            />
            <TextField
              label="E-mail do comprador"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              size="small"
              fullWidth
              disabled={salvando}
            />
            <TextField
              label="Telefone do comprador"
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              size="small"
              fullWidth
              disabled={salvando}
            />
          </Stack>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#FAFCFB" }}>
        <Button
          onClick={onClose}
          disabled={salvando}
          sx={{ color: "#063D31", fontWeight: 850, textTransform: "none" }}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={salvarCampos}
          disabled={!nomeValido || salvando}
          variant="contained"
          sx={{
            borderRadius: 2,
            fontWeight: 850,
            textTransform: "none",
            bgcolor: "#063D31",
            "&:hover": {
              bgcolor: "#052F26",
            },
          }}
        >
          {salvando ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
