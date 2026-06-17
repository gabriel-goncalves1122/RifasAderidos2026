import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { surfaces } from "../../styles/surfaces";
import { InformacoesAderidoCard } from "../detalhesAderido/InformacoesAderidoCard";
import { FormEditarAderido } from "../detalhesAderido/FormEditarAderido";
import { formatarNomeMembro } from "../../utils/formatadoresSecretaria";
import type { AderidoSecretaria, FormEditarAderido as FormEditarAderidoData } from "../../types";

interface SecretariaDetailPanelProps {
  aderido: AderidoSecretaria | null;
  open: boolean;
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

export function SecretariaDetailPanel({
  aderido,
  open,
  onClose,
  onSalvar,
}: SecretariaDetailPanelProps) {
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState<FormEditarAderidoData | null>(
    aderido ? montarFormEdicao(aderido) : null,
  );

  if (!open || !aderido || !form) return null;

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
      onClose();
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelarEdicao = () => {
    setForm(montarFormEdicao(aderido));
    setEditando(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={surfaces.panel}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main", fontWeight: 700 }}>
                {aderido.nome?.charAt(0).toUpperCase() || "?"}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight={850}
                  sx={{ lineHeight: 1.18, overflowWrap: "anywhere" }}
                >
                  {nomeExibicao}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.4, overflowWrap: "anywhere" }}
                >
                  {aderido.email || "E-mail não informado"}
                </Typography>
              </Box>
            </Stack>

            {!editando && (
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {!editando ? (
            <Stack spacing={3}>
              <InformacoesAderidoCard aderido={aderido} />
            </Stack>
          ) : (
            <Stack spacing={3}>
              <FormEditarAderido aderido={aderido} form={form} onChange={handleChange} />
            </Stack>
          )}
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ p: 2.5, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          {!editando ? (
            <Button
              variant="contained"
              onClick={() => setEditando(true)}
              startIcon={<EditIcon />}
            >
              Editar dados
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={handleCancelarEdicao} disabled={salvando}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSalvar}
                disabled={salvando}
                startIcon={salvando ? <CircularProgress size={18} /> : <SaveIcon />}
              >
                {salvando ? "Salvando..." : "Salvar dados"}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
