// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/components/detalhesAderido/FormEditarAderido.tsx
// ============================================================================
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import {
  CARGOS_COMISSAO,
  CURSOS_UNIFEI,
} from "../../../../shared/types/constants";

import {
  AderidoSecretaria,
  FormEditarAderido,
} from "../../../../shared/types/secretaria";

import {
  formatarCpf,
  formatarTelefone,
  somenteNumeros,
} from "../../utils/formatadoresSecretaria";

interface FormEditarAderidoProps {
  aderido: AderidoSecretaria;
  form: FormEditarAderido;
  onChange: (campo: keyof FormEditarAderido, valor: string) => void;
}

function normalizarCursoParaSelect(curso?: string) {
  const cursoNormalizado = curso || "";
  const cursosValidos = CURSOS_UNIFEI.map((item) => item.toUpperCase());

  return cursosValidos.includes(cursoNormalizado) ? cursoNormalizado : "";
}

function obterLabelModalidade(aderido: AderidoSecretaria) {
  return aderido.modalidade_adesao === "meio"
    ? "Meio-aderido"
    : "Aderido completo";
}

function obterLabelStatus(status?: string) {
  if (status === "ativo") return "Ativo";
  if (status === "inativo") return "Inativo";

  return "Pendente";
}

export function FormEditarAderidoComponent({
  aderido,
  form,
  onChange,
}: FormEditarAderidoProps) {
  const cursoSelecionado = normalizarCursoParaSelect(form.curso);
  const cursoLegadoForaDaLista = !!form.curso && !cursoSelecionado;

  return (
    <Stack spacing={3}>
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Edite apenas dados cadastrais. Status, modalidade, faixa de rifas,
        vendas, arrecadação e UID são dados operacionais preservados.
      </Alert>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Nome"
          value={form.nome}
          onChange={(event) => onChange("nome", event.target.value)}
          fullWidth
        />

        <TextField
          label="E-mail"
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
          fullWidth
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="CPF"
          value={formatarCpf(form.cpf)}
          onChange={(event) => {
            // Mantém o estado limpo para persistência, mas exibe formatado na tela.
            onChange("cpf", somenteNumeros(event.target.value).slice(0, 11));
          }}
          fullWidth
          inputProps={{
            inputMode: "numeric",
            maxLength: 14,
          }}
        />

        <TextField
          label="Telefone"
          value={formatarTelefone(form.telefone)}
          onChange={(event) => {
            // Mantém o estado limpo para persistência, mas exibe formatado na tela.
            onChange(
              "telefone",
              somenteNumeros(event.target.value).slice(0, 11),
            );
          }}
          fullWidth
          inputProps={{
            inputMode: "numeric",
            maxLength: 15,
          }}
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Curso</InputLabel>
          <Select
            value={cursoSelecionado}
            label="Curso"
            onChange={(event) => onChange("curso", event.target.value)}
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
          onChange={(event) => onChange("data_nascimento", event.target.value)}
          fullWidth
        />
      </Stack>

      {cursoLegadoForaDaLista && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          O curso atual está salvo como “{form.curso}”, mas não existe na lista
          padronizada. Selecione um curso da lista para normalizar o cadastro.
        </Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Gênero"
          value={form.genero}
          onChange={(event) => onChange("genero", event.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Cargo</InputLabel>
          <Select
            value={form.cargo}
            label="Cargo"
            onChange={(event) => onChange("cargo", event.target.value)}
          >
            {CARGOS_COMISSAO.map((cargo) => (
              <MenuItem key={cargo.id} value={cargo.id}>
                {cargo.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Modalidade"
          value={obterLabelModalidade(aderido)}
          fullWidth
          disabled
          helperText="A modalidade é definida na criação e não pode ser alterada."
        />

        <TextField
          label="Status"
          value={obterLabelStatus(aderido.status_cadastro)}
          fullWidth
          disabled
          helperText="O status não pode ser alterado pela edição cadastral."
        />
      </Stack>
    </Stack>
  );
}
