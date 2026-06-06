
import { useMediaQuery, useTheme } from "@mui/material";

import { PixTransacoesFiltrosDesktop } from "./filtros/PixTransacoesFiltrosDesktop";
import { PixTransacoesFiltrosMobile } from "./filtros/PixTransacoesFiltrosMobile";
import { PixTransacoesFiltrosProps } from "./filtros/pixTransacoesFiltrosTypes";

export function PixTransacoesFiltros(props: PixTransacoesFiltrosProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <PixTransacoesFiltrosMobile {...props} />
  ) : (
    <PixTransacoesFiltrosDesktop {...props} />
  );
}
