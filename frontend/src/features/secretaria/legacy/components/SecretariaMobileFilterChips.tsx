import { Box, Chip } from "@mui/material";
import type { StatusCadastro } from "../../../../../shared/types/secretaria";

interface Contadores {
  ativo: number;
  pendente: number;
  inativo: number;
}

interface SecretariaMobileFilterChipsProps {
  active: "todos" | StatusCadastro;
  onChange: (val: "todos" | StatusCadastro) => void;
  contadores?: Contadores;
}

const FILTERS: { label: string; value: "todos" | StatusCadastro }[] = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: "ativo" },
  { label: "Pendentes", value: "pendente" },
  { label: "Inativos", value: "inativo" },
];

export function SecretariaMobileFilterChips({ active, onChange, contadores }: SecretariaMobileFilterChipsProps) {
  return (
    <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { display: "none" } }}>
      {FILTERS.map((f) => (
        <Chip
          key={f.value}
          label={
            f.value !== "todos" && contadores
              ? `${f.label} (${contadores[f.value]})`
              : f.label
          }
          size="small"
          variant={active === f.value ? "filled" : "outlined"}
          color={active === f.value ? "primary" : "default"}
          onClick={() => onChange(f.value)}
          sx={{ flexShrink: 0, borderRadius: 2, fontWeight: 500 }}
        />
      ))}
    </Box>
  );
}
