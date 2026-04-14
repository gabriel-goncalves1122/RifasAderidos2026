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
} from "@mui/material";
import { CURSOS_UNIFEI, CARGOS_COMISSAO } from "../../../types/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (dados: any) => Promise<void>;
}

export function ModalAdicionarAderido({ open, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const [isComissao, setIsComissao] = useState(false);

  // Inicializamos o cargo com "" para evitar o aviso do MUI quando a dropdown não tem opções.
  const [form, setForm] = useState({
    email: "",
    nome: "",
    curso: "",
    telefone: "",
    dataNascimento: "",
    cargo: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async () => {
    if (!form.email) return;
    setLoading(true);
    try {
      const dadosFinais = {
        ...form,
        // Se não for comissão, forçamos o envio de "aderido" para o backend
        cargo: isComissao ? form.cargo : "aderido",
      };
      await onConfirm(dadosFinais);

      setForm({
        email: "",
        nome: "",
        curso: "",
        telefone: "",
        dataNascimento: "",
        cargo: "",
      });
      setIsComissao(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const cargosMenu = CARGOS_COMISSAO.filter((c) => c.id !== "aderido");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ timeout: 300 }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
        Autorizar Novo Aderido
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Apenas o e-mail da Keeper é obrigatório. Os restantes dados poderão
          ser preenchidos pelo formando posteriormente.
        </Typography>

        <Stack spacing={3}>
          <TextField
            name="email"
            label="E-mail da Keeper (Obrigatório) *"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            placeholder="exemplo@unifei.br"
            disabled={loading}
          />

          <TextField
            name="nome"
            label="Nome Completo (Opcional)"
            fullWidth
            value={form.nome}
            onChange={handleChange}
            disabled={loading}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="curso-label">Curso (Opcional)</InputLabel>
              <Select
                labelId="curso-label"
                name="curso"
                value={form.curso}
                label="Curso (Opcional)"
                onChange={handleChange}
              >
                {CURSOS_UNIFEI.map((c) => (
                  <MenuItem key={c} value={c.toUpperCase()}>
                    {c}
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
            label="Telefone (Opcional)"
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
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsComissao(checked);
                    if (checked) {
                      setForm((prev) => ({ ...prev, cargo: cargosMenu[0].id })); // Preenche com o 1º válido (Presidência)
                    } else {
                      setForm((prev) => ({ ...prev, cargo: "" })); // Limpa
                    }
                  }}
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
            {/* Usamos data-testid para o Vitest encontrar a área da comissão sem confundir os labels do MUI */}
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
            "Autorizar Acesso"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
