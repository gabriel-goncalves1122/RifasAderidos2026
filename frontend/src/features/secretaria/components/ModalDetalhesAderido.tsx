// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/ModalDetalhesAderido.tsx
// ============================================================================
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  CARGOS_COMISSAO,
  CURSOS_UNIFEI,
} from "../../../shared/types/constants";
import {
  AderidoSecretaria,
  FormEditarAderido,
  ModalidadeAdesao,
  StatusCadastro,
} from "../../../shared/types/secretaria";
import { useSecretaria } from "../hooks/useSecretaria";

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
    modalidade_adesao: aderido.modalidade_adesao || "completo",
    status_cadastro: aderido.status_cadastro || "pendente",
  };
}

function LinhaDetalhe({
  label,
  valor,
}: {
  label: string;
  valor?: string | number | null;
}) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {valor || "Não informado"}
      </Typography>
    </Box>
  );
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
    if (aderido) {
      setForm(montarFormEdicao(aderido));
      setEditando(false);
    }
  }, [aderido]);

  if (!aderido || !form) return null;

  const handleChange = (campo: keyof FormEditarAderido, valor: string) => {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [campo]: valor,
      };
    });
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
        Dados do Aderido
      </DialogTitle>

      <DialogContent dividers>
        {!editando ? (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {aderido.nome || "Nome não definido"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {aderido.email}
              </Typography>
            </Box>

            <Divider />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <LinhaDetalhe label="ID do documento" valor={aderido.id} />
              <LinhaDetalhe label="ID do aderido" valor={aderido.id_aderido} />
              <LinhaDetalhe label="CPF" valor={aderido.cpf} />
              <LinhaDetalhe label="Telefone" valor={aderido.telefone} />
              <LinhaDetalhe label="Curso" valor={aderido.curso} />
              <LinhaDetalhe label="Gênero" valor={aderido.genero} />
              <LinhaDetalhe
                label="Data de nascimento"
                valor={aderido.data_nascimento}
              />
              <LinhaDetalhe label="Cargo" valor={aderido.cargo} />
              <LinhaDetalhe
                label="Modalidade"
                valor={
                  aderido.modalidade_adesao === "meio"
                    ? "Meio-aderido"
                    : "Aderido completo"
                }
              />
              <LinhaDetalhe label="Status" valor={aderido.status_cadastro} />
              <LinhaDetalhe
                label="Faixa de rifas"
                valor={
                  aderido.faixa_rifas
                    ? `${aderido.faixa_rifas.inicio || "-"} até ${
                        aderido.faixa_rifas.fim || "-"
                      }`
                    : "Não informada"
                }
              />
              <LinhaDetalhe
                label="Rifas vendidas"
                valor={aderido.rifas_vendidas}
              />
              <LinhaDetalhe
                label="Total arrecadado"
                valor={
                  aderido.total_arrecadado !== undefined
                    ? `R$ ${aderido.total_arrecadado.toFixed(2)}`
                    : "R$ 0,00"
                }
              />
            </Box>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Edite apenas dados cadastrais. Campos operacionais como UID, faixa
              de rifas, vendas e arrecadação são preservados.
            </Typography>

            <TextField
              label="Nome"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              fullWidth
            />

            <TextField
              label="E-mail"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="CPF"
                value={form.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                fullWidth
              />

              <TextField
                label="Telefone"
                value={form.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Curso</InputLabel>
                <Select
                  value={form.curso}
                  label="Curso"
                  onChange={(e) => handleChange("curso", e.target.value)}
                >
                  <MenuItem value="">Não informado</MenuItem>
                  {CURSOS_UNIFEI.map((curso) => (
                    <MenuItem key={curso} value={curso.toUpperCase()}>
                      {curso}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Data de nascimento"
                value={form.data_nascimento}
                onChange={(e) =>
                  handleChange("data_nascimento", e.target.value)
                }
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Cargo</InputLabel>
                <Select
                  value={form.cargo}
                  label="Cargo"
                  onChange={(e) => handleChange("cargo", e.target.value)}
                >
                  {CARGOS_COMISSAO.map((cargo) => (
                    <MenuItem key={cargo.id} value={cargo.id}>
                      {cargo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Modalidade</InputLabel>
                <Select
                  value={form.modalidade_adesao}
                  label="Modalidade"
                  onChange={(e) =>
                    handleChange(
                      "modalidade_adesao",
                      e.target.value as ModalidadeAdesao,
                    )
                  }
                >
                  <MenuItem value="completo">Aderido completo</MenuItem>
                  <MenuItem value="meio">Meio-aderido</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status_cadastro}
                label="Status"
                onChange={(e) =>
                  handleChange(
                    "status_cadastro",
                    e.target.value as StatusCadastro,
                  )
                }
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={salvando}>
          Fechar
        </Button>

        {!editando ? (
          <Button variant="contained" onClick={() => setEditando(true)}>
            Editar Dados
          </Button>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => {
                setForm(montarFormEdicao(aderido));
                setEditando(false);
              }}
              disabled={salvando}
            >
              Cancelar edição
            </Button>

            <Button
              variant="contained"
              onClick={handleSalvar}
              disabled={salvando}
            >
              {salvando ? <CircularProgress size={22} /> : "Salvar alterações"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
