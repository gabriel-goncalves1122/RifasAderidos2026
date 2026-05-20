// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/components/ModalDetalhesAderido.tsx
// ============================================================================
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

import { formatarCpf, formatarTelefone } from "../utils/formatadoresSecretaria";

import {
  AderidoSecretaria,
  FormEditarAderido,
} from "../../../shared/types/secretaria";

import { useSecretaria } from "../hooks/useSecretaria";
import { InfoItem } from "./detalhesAderido/InfoItem";
import { ResumoOperacionalAderido } from "./detalhesAderido/ResumoOperacionaAderido";
import { FormEditarAderidoComponent } from "./detalhesAderido/FormEditarAderido";

interface ModalDetalhesAderidoProps {
  open: boolean;
  aderido: AderidoSecretaria | null;
  onClose: () => void;
  onAtualizado: () => Promise<void>;
}

function montarFormEdicao(aderido: AderidoSecretaria): FormEditarAderido {
  return {
    nome: aderido.nome || "",
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

export function ModalDetalhesAderido({
  open,
  aderido,
  onClose,
  onAtualizado,
}: ModalDetalhesAderidoProps) {
  const { atualizarAderidoSecretaria } = useSecretaria();

  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState<FormEditarAderido | null>(null);

  useEffect(() => {
    if (!aderido) return;

    setForm(montarFormEdicao(aderido));
    setEditando(false);
  }, [aderido]);

  if (!aderido || !form) return null;

  const nomeExibicao = aderido.nome || "Nome não definido";
  const inicialAvatar = aderido.nome?.charAt(0).toUpperCase() || "?";

  const handleChange = (campo: keyof FormEditarAderido, valor: string) => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [campo]: valor,
      };
    });
  };

  const handleFechar = () => {
    setEditando(false);
    onClose();
  };

  const handleCancelarEdicao = () => {
    setForm(montarFormEdicao(aderido));
    setEditando(false);
  };

  const handleSalvar = async () => {
    setSalvando(true);

    try {
      await atualizarAderidoSecretaria(aderido.id, form);
      await onAtualizado();

      setEditando(false);
      onClose();
    } catch (error: any) {
      alert(`Erro ao atualizar aderido: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleFechar} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          p: 3,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: "primary.main",
              fontWeight: 700,
            }}
          >
            {inicialAvatar}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={800}>
              Dados do Aderido
            </Typography>

            <Typography variant="body2" color="text.secondary" noWrap>
              {nomeExibicao} • {aderido.email || "E-mail não informado"}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <ResumoOperacionalAderido aderido={aderido} />

          {!editando ? (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon color="primary" />

                <Typography variant="subtitle1" fontWeight={800}>
                  Informações cadastrais
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                <InfoItem label="ID do documento" valor={aderido.id} />
                <InfoItem label="ID do aderido" valor={aderido.id_aderido} />
                <InfoItem label="CPF" valor={formatarCpf(aderido.cpf)} />
                <InfoItem
                  label="Telefone"
                  valor={formatarTelefone(aderido.telefone)}
                />
                <InfoItem label="Curso" valor={aderido.curso} />
                <InfoItem label="Gênero" valor={aderido.genero} />
                <InfoItem
                  label="Data de nascimento"
                  valor={aderido.data_nascimento}
                />
                <InfoItem label="Cargo" valor={aderido.cargo} />
              </Box>
            </>
          ) : (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <EditIcon color="primary" />

                <Typography variant="subtitle1" fontWeight={800}>
                  Editar dados cadastrais
                </Typography>
              </Stack>

              <FormEditarAderidoComponent
                aderido={aderido}
                form={form}
                onChange={handleChange}
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={handleFechar}
          color="inherit"
          disabled={salvando}
          startIcon={<CloseIcon />}
        >
          Fechar
        </Button>

        {!editando ? (
          <Button
            variant="contained"
            onClick={() => setEditando(true)}
            startIcon={<EditIcon />}
          >
            Editar Dados
          </Button>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={handleCancelarEdicao}
              disabled={salvando}
            >
              Cancelar edição
            </Button>

            <Button
              variant="contained"
              onClick={handleSalvar}
              disabled={salvando}
              startIcon={
                salvando ? <CircularProgress size={18} /> : <SaveIcon />
              }
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
