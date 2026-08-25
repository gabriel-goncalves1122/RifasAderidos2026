import { Paper } from "@mui/material";

import { colors } from "@/shared/tokens/colors";

import { PixTransacoesCampoBusca } from "./PixTransacoesCampoBusca";
import { PixTransacoesFiltrosChips } from "./PixTransacoesFiltrosChips";
import { PixTransacoesFiltrosProps } from "./pixTransacoesFiltrosTypes";

export function PixTransacoesFiltrosDesktop({
  filtros,
  onChangeFiltros,
}: PixTransacoesFiltrosProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2.25,
        bgcolor: colors.branco,
        border: `1px solid ${colors.borda}`,
      }}
    >
      <PixTransacoesCampoBusca filtros={filtros} onChangeFiltros={onChangeFiltros} />
      <PixTransacoesFiltrosChips
        filtros={filtros}
        onChangeFiltros={onChangeFiltros}
      />
    </Paper>
  );
}
