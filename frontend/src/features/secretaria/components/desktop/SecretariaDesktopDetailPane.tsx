import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";

import { InformacoesAderidoCard } from "../detalhesAderido/InformacoesAderidoCard";
import { FormEditarAderido } from "../detalhesAderido/FormEditarAderido";
import { formatarNomeMembro } from "../../utils/formatadoresSecretaria";
import type { AderidoSecretaria, FormEditarAderido as FormEditarAderidoData } from "../../types";

interface SecretariaDesktopDetailPaneProps {
  aderido: AderidoSecretaria | null;
  onClose: () => void;
  onSalvar: (id: string, dados: FormEditarAderidoData) => Promise<void>;
}

function montarFormEdicao(aderido: AderidoSecretaria): FormEditarAderidoData {
  return {
    nome: formatarNomeMembro(aderido.nome),
    email: aderido.email || "",
    telefone: aderido.telefone || "",
    cpf: aderido.cpf || "",
    curso: aderido.curso || "",
    genero: aderido.genero || "",
    data_nascimento: aderido.data_nascimento || "",
    cargo: aderido.cargo || "aderido",
    status_cadastro: aderido.status_cadastro || "pendente",
  };
}

export function SecretariaDesktopDetailPane({
  aderido,
  onClose,
  onSalvar,
}: SecretariaDesktopDetailPaneProps) {
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState<FormEditarAderidoData | null>(null);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const pendingFormRef = useRef<FormEditarAderidoData | null>(null);

  useEffect(() => {
    if (!aderido) {
      setForm(null);
      setEditando(false);
      return;
    }

    const novoForm = montarFormEdicao(aderido);

    if (!form) {
      setForm(novoForm);
      return;
    }

    if (JSON.stringify(form) !== JSON.stringify(novoForm)) {
      if (editando) {
        pendingFormRef.current = novoForm;
        setConfirmDiscardOpen(true);
        return;
      }

      setForm(novoForm);
      setEditando(false);
    }
  }, [aderido?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirmDiscard = () => {
    if (pendingFormRef.current) {
      setForm(pendingFormRef.current);
      setEditando(false);
    }
    setConfirmDiscardOpen(false);
    pendingFormRef.current = null;
  };

  const handleCancelDiscard = () => {
    setConfirmDiscardOpen(false);
    pendingFormRef.current = null;
  };

  if (!aderido || !form) {
    return (
      <Box
        sx={{
          width: { md: 340, lg: 400, xl: 480 },
          borderLeft: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "#fafafa",
        }}
      >
        <PersonIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
        <Typography variant="body2" color="text.disabled" textAlign="center">
          Selecione um aderido na lista para ver os detalhes
        </Typography>
      </Box>
    );
  }

  const nomeExibicao = formatarNomeMembro(aderido.nome) || "Nome não definido";

  const handleChange = (campo: keyof FormEditarAderidoData, valor: string) => {
    setForm((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await onSalvar(aderido.id, {
        ...form,
        nome: formatarNomeMembro(form.nome),
      });
      setEditando(false);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelarEdicao = () => {
    setForm(montarFormEdicao(aderido));
    setEditando(false);
  };

  return (
    <>
      <Box
        sx={{
          width: { md: 340, lg: 400, xl: 480 },
          borderLeft: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
          overflow: "hidden",
          animation: 'slideIn 0.3s ease-out',
          '@keyframes slideIn': {
            from: { opacity: 0, transform: 'translateX(20px)' },
            to: { opacity: 1, transform: 'translateX(0)' }
          },
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", fontWeight: 700 }}>
                {aderido.nome?.charAt(0).toUpperCase() || "?"}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={850}
                  sx={{ lineHeight: 1.18, overflowWrap: "anywhere" }}
                >
                  {nomeExibicao}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.4, overflowWrap: "anywhere" }}
                >
                  {aderido.email || "E-mail não informado"}
                </Typography>
              </Box>
            </Stack>

            {!editando && (
              <IconButton onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", p: 2.5 }}>
          {!editando ? (
            <Stack spacing={2}>
              <InformacoesAderidoCard aderido={aderido} />
            </Stack>
          ) : (
            <Stack spacing={2}>
              <FormEditarAderido aderido={aderido} form={form} onChange={handleChange} />
            </Stack>
          )}
        </Box>

        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          {!editando ? (
            <Button
              variant="contained"
              size="small"
              onClick={() => setEditando(true)}
              startIcon={<EditIcon />}
            >
              Editar dados
            </Button>
          ) : (
            <>
              <Button size="small" color="inherit" onClick={handleCancelarEdicao} disabled={salvando}>
                Cancelar
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSalvar}
                disabled={salvando}
                startIcon={salvando ? <CircularProgress size={16} /> : <SaveIcon />}
              >
                {salvando ? "Salvando..." : "Salvar dados"}
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={confirmDiscardOpen} onClose={handleCancelDiscard}>
        <DialogTitle>Alterações não salvas</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você está editando os dados de <strong>{nomeExibicao}</strong> e há alterações não salvas.
            Deseja descartar as alterações e ver os dados do próximo aderido?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDiscard} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDiscard} color="warning" variant="contained">
            Descartar alterações
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
