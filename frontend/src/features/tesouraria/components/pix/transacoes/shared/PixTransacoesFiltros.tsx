
import { useTesourariaLayout } from "../../../../hooks/useTesourariaLayout";

import { PixTransacoesFiltrosDesktop } from "./filtros/PixTransacoesFiltrosDesktop";
import { PixTransacoesFiltrosMobile } from "./filtros/PixTransacoesFiltrosMobile";
import { PixTransacoesFiltrosProps } from "./filtros/pixTransacoesFiltrosTypes";

export function PixTransacoesFiltros(props: PixTransacoesFiltrosProps) {
  const { isMobile } = useTesourariaLayout();

  return isMobile ? (
    <PixTransacoesFiltrosMobile {...props} />
  ) : (
    <PixTransacoesFiltrosDesktop {...props} />
  );
}
