// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/ModalAdicionarAderido.tsx
// ============================================================================
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Collapse,
  Stack,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import {
  CURSOS_UNIFEI,
  CARGOS_COMISSAO,
} from "../../../shared/types/constants";
import {
  FormNovoAderido,
  ModalidadeAdesao,
} from "../../../shared/types/secretaria";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (dados: FormNovoAderido) => Promise<void>;
}

const formInicial: FormNovoAderido = {
  email: "",
  nome: "",
  curso: "",
  telefone: "",
  dataNascimento: "",
  cargo: "",
  modalidade_adesao: "completo",
};

export function ModalAdicionarAderido({ open, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const [isComissao, setIsComissao] = useState(false);
  const [form, setForm] = useState<FormNovoAderido>(formInicial);

  const cargosMenu = CARGOS_COMISSAO.filter((cargo) => cargo.id !== "aderido");

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalidadeChange = (
    _: React.MouseEvent<HTMLElement>,
    novaModalidade: ModalidadeAdesao | null,
  ) => {
    if (!novaModalidade) return;

    setForm((prev) => ({
      ...prev,
      modalidade_adesao: novaModalidade,
    }));
  };

  const handleComissaoChange = (checked: boolean) => {
    setIsComissao(checked);

    setForm((prev) => ({
      ...prev,
      // Cargo controla permissão; modalidade controla regra administrativa da adesão.
      cargo: checked ? cargosMenu[0]?.id || "" : "",
    }));
  };

  const limparFormulario = () => {
    setForm(formInicial);
    setIsComissao(false);
  };

  const handleSalvar = async () => {
    if (!form.email) return;

    setLoading(true);

    try {
      const dadosFinais: FormNovoAderido = {
        ...form,
        // Usuário sem cargo de comissão continua com perfil padrão de aderido.
        cargo: isComissao ? form.cargo : "aderido",
      };

      await onConfirm(dadosFinais);

      limparFormulario();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ timeout: 300 }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
        Nova Adesão
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Selecione primeiro o tipo de cadastro. Depois informe o e-mail usado
          na Keeper e, se disponível, os dados pessoais do formando.
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              color="text.primary"
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              Tipo de cadastro
            </Typography>

            <ToggleButtonGroup
              exclusive
              fullWidth
              color="primary"
              value={form.modalidade_adesao}
              onChange={handleModalidadeChange}
              disabled={loading}
            >
              <ToggleButton value="completo">Aderido completo</ToggleButton>
              <ToggleButton value="meio">Meio-aderido</ToggleButton>
            </ToggleButtonGroup>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Essa escolha define a modalidade administrativa da adesão, sem
              alterar automaticamente as permissões do usuário.
            </Typography>
          </Box>

          <TextField
            name="email"
            label="E-mail da Keeper *"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            placeholder="exemplo@unifei.br"
            disabled={loading}
          />

          <TextField
            name="nome"
            label="Nome completo"
            fullWidth
            value={form.nome}
            onChange={handleChange}
            disabled={loading}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="curso-label">Curso</InputLabel>
              <Select
                labelId="curso-label"
                name="curso"
                value={form.curso}
                label="Curso"
                onChange={handleChange}
              >
                {CURSOS_UNIFEI.map((curso) => (
                  <MenuItem key={curso} value={curso.toUpperCase()}>
                    {curso}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="dataNascimento"
              label="Data de Nascimento"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.dataNascimento}
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>

          <TextField
            name="telefone"
            label="Telefone"
            fullWidth
            placeholder="(35) 9..."
            value={form.telefone}
            onChange={handleChange}
            disabled={loading}
          />

          <Box
            sx={{
              p: 2,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isComissao}
                  onChange={(e) => handleComissaoChange(e.target.checked)}
                  disabled={loading}
                  color="primary"
                  inputProps={{ "aria-label": "Checkbox Comissão" }}
                />
              }
              label={
                <Typography
                  variant="body1"
                  fontWeight={isComissao ? "bold" : "normal"}
                >
                  Este membro atua na Comissão de Formatura?
                </Typography>
              }
            />

            <Collapse in={isComissao} data-testid="area-comissao">
              <Box sx={{ mt: 2, pb: 1 }}>
                <FormControl fullWidth disabled={loading}>
                  <InputLabel id="cargo-comissao-label">
                    Cargo na Comissão
                  </InputLabel>

                  <Select
                    labelId="cargo-comissao-label"
                    name="cargo"
                    value={form.cargo}
                    label="Cargo na Comissão"
                    onChange={handleChange}
                  >
                    {cargosMenu.map((cargo) => (
                      <MenuItem key={cargo.id} value={cargo.id}>
                        {cargo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Collapse>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>

        <Button
          onClick={handleSalvar}
          variant="contained"
          disabled={loading || !form.email}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Autorizar Adesão"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
