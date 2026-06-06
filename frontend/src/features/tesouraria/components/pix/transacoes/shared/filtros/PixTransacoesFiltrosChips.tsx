import { Chip, Stack } from "@mui/material";

import { FILTROS_PIX, PixTransacoesFiltrosProps } from "./pixTransacoesFiltrosTypes";

function estiloChip(ativo: boolean) {
  return {
    height: 34,
    borderRadius: 999,
    fontWeight: 850,
    px: 0.75,
    bgcolor: ativo ? "#063D31" : "#FFFFFF",
    color: ativo ? "#FFFFFF" : "#063D31",
    border: ativo
      ? "1px solid #063D31"
      : "1px solid rgba(6, 61, 49, 0.18)",
    "&:hover": {
      bgcolor: ativo ? "#052F26" : "#EAF3EF",
    },
  };
}

interface PixTransacoesFiltrosChipsProps extends PixTransacoesFiltrosProps {
  marginTop?: number;
}

export function PixTransacoesFiltrosChips({
  filtros,
  onChangeFiltros,
  marginTop = 1.25,
}: PixTransacoesFiltrosChipsProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="nowrap"
      useFlexGap
      sx={{
        mt: marginTop,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "auto",
        overscrollBehaviorX: "contain",
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "x proximity",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {FILTROS_PIX.map((filtro) => (
        <Chip
          key={filtro.value}
          label={filtro.label}
          clickable
          onClick={() =>
            onChangeFiltros({
              ...filtros,
              status: filtro.value,
            })
          }
          sx={{
            ...estiloChip(filtros.status === filtro.value),
            flexShrink: 0,
            scrollSnapAlign: "start",
          }}
        />
      ))}
    </Stack>
  );
}
