import { useMediaQuery, useTheme } from "@mui/material";

import { AuditoriaComprasFiltrosDesktop } from "../desktop/AuditoriaComprasFiltrosDesktop";
import { AuditoriaComprasFiltrosMobile } from "../mobile/AuditoriaComprasFiltrosMobile";
import { AuditoriaComprasFiltrosProps } from "./auditoriaComprasFiltrosTypes";

export function AuditoriaComprasFiltros(
  props: AuditoriaComprasFiltrosProps,
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <AuditoriaComprasFiltrosMobile {...props} />
  ) : (
    <AuditoriaComprasFiltrosDesktop {...props} />
  );
}
