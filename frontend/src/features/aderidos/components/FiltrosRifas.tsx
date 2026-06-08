// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/FiltrosRifas.tsx
// ============================================================================
import { Chip, Stack, SxProps, Theme } from "@mui/material";

import { painelAderidoStyles } from "../styles/painelAderidoStyles";
import { FiltroRifasAderido } from "../types/painelAderido";

interface FiltrosRifasProps {
  filtro: FiltroRifasAderido;
  onChangeFiltro: (filtro: FiltroRifasAderido) => void;
}

const FILTROS: Array<{
  label: string;
  value: FiltroRifasAderido;
}> = [
  {
    label: "Todas",
    value: "todas",
  },
  {
    label: "Disponíveis",
    value: "disponivel",
  },
  {
    label: "Em análise",
    value: "pendente",
  },
  {
    label: "Pagas",
    value: "pago",
  },
  {
    label: "Negadas",
    value: "recusado",
  },
];

const ESTILOS_ATIVOS_POR_FILTRO: Record<FiltroRifasAderido, SxProps<Theme>> = {
  todas: {
    bgcolor: "#063D31",
    color: "#FFFFFF",
    borderColor: "#063D31",
    boxShadow: "0 8px 16px rgba(6, 61, 49, 0.16)",

    "&:hover": {
      bgcolor: "#021B16",
      borderColor: "#021B16",
    },
  },

  disponivel: {
    bgcolor: "#EAF7F1",
    color: "#064532",
    borderColor: "#8DBEAD",
    boxShadow: "0 8px 16px rgba(6, 69, 50, 0.10)",

    "&:hover": {
      bgcolor: "#DDF1E9",
      borderColor: "#6FAE98",
    },
  },

  reservado: {
    bgcolor: "#F3F4F6",
    color: "#374151",
    borderColor: "#BFC5CC",
    boxShadow: "0 8px 16px rgba(55, 65, 81, 0.10)",

    "&:hover": {
      bgcolor: "#E8EAEE",
      borderColor: "#AEB5BF",
    },
  },

  pendente: {
    bgcolor: "#FFF4D8",
    color: "#6B4A00",
    borderColor: "#CBA64D",
    boxShadow: "0 8px 16px rgba(107, 74, 0, 0.10)",

    "&:hover": {
      bgcolor: "#FFE9AD",
      borderColor: "#A88123",
    },
  },

  pago: {
    bgcolor: "#E7F6EE",
    color: "#0B5136",
    borderColor: "#5DAE83",
    boxShadow: "0 8px 16px rgba(11, 81, 54, 0.12)",

    "&:hover": {
      bgcolor: "#D8EFE4",
      borderColor: "#3F966A",
    },
  },

  recusado: {
    bgcolor: "#FAD6D6",
    color: "#8E1F1F",
    borderColor: "#C84F4F",
    boxShadow: "0 8px 16px rgba(142, 31, 31, 0.13)",

    "&:hover": {
      bgcolor: "#F2C3C3",
      borderColor: "#C84F4F",
    },
  },
};

function montarEstiloFiltro(
  ativo: boolean,
  value: FiltroRifasAderido,
): SxProps<Theme> {
  // Mantém todos os filtros inativos com o padrão branco.
  if (!ativo) {
    return painelAderidoStyles.filtroChip;
  }

  return {
    ...(painelAderidoStyles.filtroChip as object),

    // O filtro ativo assume a cor semântica da categoria selecionada.
    ...(ESTILOS_ATIVOS_POR_FILTRO[value] as object),

    "& .MuiChip-label": {
      fontWeight: 900,
    },
  };
}

export function FiltrosRifas({ filtro, onChangeFiltro }: FiltrosRifasProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={painelAderidoStyles.filtrosContainer}
      role="tablist"
      aria-label="Filtros de rifas"
    >
      {FILTROS.map((item) => {
        const ativo = filtro === item.value;

        return (
          <Chip
            key={item.value}
            label={item.label}
            clickable
            role="tab"
            aria-selected={ativo}
            tabIndex={ativo ? 0 : -1}
            onClick={() => onChangeFiltro(item.value)}
            sx={montarEstiloFiltro(ativo, item.value)}
          />
        );
      })}
    </Stack>
  );
}
