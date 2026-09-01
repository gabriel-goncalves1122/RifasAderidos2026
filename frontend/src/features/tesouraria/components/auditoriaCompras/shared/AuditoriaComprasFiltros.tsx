import { useTesourariaLayout } from "../../../hooks/useTesourariaLayout";

import { AuditoriaComprasFiltrosDesktop } from "../desktop/AuditoriaComprasFiltrosDesktop";
import { AuditoriaComprasFiltrosMobile } from "../mobile/AuditoriaComprasFiltrosMobile";
import { AuditoriaComprasFiltrosProps } from "./auditoriaComprasFiltrosTypes";

export function AuditoriaComprasFiltros(
  props: AuditoriaComprasFiltrosProps,
) {
  const { isMobile } = useTesourariaLayout();

  return isMobile ? (
    <AuditoriaComprasFiltrosMobile {...props} />
  ) : (
    <AuditoriaComprasFiltrosDesktop {...props} />
  );
}
