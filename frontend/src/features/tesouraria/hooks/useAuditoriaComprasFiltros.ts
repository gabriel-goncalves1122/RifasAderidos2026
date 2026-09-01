import { useMemo, useState, useCallback } from "react";
import { AuditoriaComprasFiltros, TransacaoTesouraria } from "../types/auditoriaCompras";
import {
  FILTROS_AUDITORIA_COMPRAS_VAZIOS,
  filtrarComprasAuditaveis,
  filtrosAuditoriaAtivos,
} from "../utils/auditoriaComprasUtils";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function useAuditoriaComprasFiltros(
  historicoTransacoes: TransacaoTesouraria[]
) {
  const [filtros, setFiltros] = useState<AuditoriaComprasFiltros>(
    FILTROS_AUDITORIA_COMPRAS_VAZIOS
  );

  const debouncedBusca = useDebounce(filtros.busca, 250);

  const comprasFiltradas = useMemo(
    () =>
      filtrarComprasAuditaveis(historicoTransacoes, {
        ...filtros,
        busca: debouncedBusca,
      }),
    [historicoTransacoes, filtros, debouncedBusca]
  );

  const limparFiltros = useCallback(() => {
    setFiltros(FILTROS_AUDITORIA_COMPRAS_VAZIOS);
  }, []);

  return {
    filtros,
    comprasFiltradas,
    filtrosAtivos: filtrosAuditoriaAtivos(filtros),
    possuiResultados: comprasFiltradas.length > 0,
    setFiltros,
    limparFiltros,
  };
}
