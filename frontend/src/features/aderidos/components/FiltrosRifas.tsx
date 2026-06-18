// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/FiltrosRifas.tsx
// ============================================================================
import { Chip, Stack, SxProps, Theme } from "@mui/material";

import { painelAderidoStyles } from "../styles/painelAderidoStyles";
import { FiltroRifasAderido } from "../types/painelAderido";
import {
  ContadoresRifas,
  FiltroRifasOpcao,
  montarOpcoesFiltroRifas,
} from "../utils/filtrosRifas";

interface FiltrosRifasProps {
  filtro: FiltroRifasAderido;
  contadores: ContadoresRifas;
  onChangeFiltro: (filtro: FiltroRifasAderido) => void;
}

function montarEstiloFiltro(
  ativo: boolean,
  item: FiltroRifasOpcao,
): SxProps<Theme> {
  // Mantém todos os filtros inativos com o padrão branco.
  if (!ativo) {
    return painelAderidoStyles.filtroChip;
  }

  return {
    ...(painelAderidoStyles.filtroChip as object),

    // O filtro ativo assume a cor semântica da categoria selecionada.
    bgcolor: item.bg,
    color: item.color,
    borderColor: item.border,
    boxShadow: "0 10px 22px rgba(2, 27, 22, 0.09)",

    "&:hover": {
      bgcolor: item.hoverBg,
      borderColor: item.border,
    },

    "& .MuiChip-label": {
      fontWeight: 900,
    },
  };
}

export function FiltrosRifas({
  filtro,
  contadores,
  onChangeFiltro,
}: FiltrosRifasProps) {
  const filtros = montarOpcoesFiltroRifas(contadores, filtro);

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={painelAderidoStyles.filtrosContainer}
      role="tablist"
      aria-label="Filtros de rifas"
    >
      {filtros.map((item) => {
        const ativo = filtro === item.value;

        return (
          <Chip
            key={item.value}
            label={item.label}
            clickable
            role="tab"
            aria-label={item.label}
            aria-selected={ativo}
            tabIndex={ativo ? 0 : -1}
            onClick={() => onChangeFiltro(item.value)}
            sx={montarEstiloFiltro(ativo, item)}
          />
        );
      })}
    </Stack>
  );
}
