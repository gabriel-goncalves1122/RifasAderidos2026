import { useCallback, useEffect, useMemo, useState } from "react";

import {
  CompraAuditavel,
  AuditoriaComprasFiltros,
  TransacaoAuditoriaComprasBase,
} from "../types/auditoriaCompras";
import {
  agruparComprasAuditaveis,
  calcularResumoAuditoria,
  criarCsvAuditoriaCompras,
  FILTROS_AUDITORIA_COMPRAS_VAZIOS,
  filtrarComprasAuditaveis,
  filtrosAuditoriaAtivos,
} from "../utils/auditoriaComprasUtils";
import { auditoriaComprasService } from "../services/auditoriaComprasService";

export function useAuditoriaComprasController() {
  const [carregando, setCarregando] = useState(true);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<
    TransacaoAuditoriaComprasBase[]
  >([]);
  const [filtros, setFiltros] = useState<AuditoriaComprasFiltros>(
    FILTROS_AUDITORIA_COMPRAS_VAZIOS,
  );
  const [compraSelecionada, setCompraSelecionada] =
    useState<CompraAuditavel | null>(null);
  const [compraEdicao, setCompraEdicao] = useState<CompraAuditavel | null>(
    null,
  );
  const [comprovanteUrl, setComprovanteUrl] = useState<string | null>(null);

  const carregarHistorico = useCallback(async () => {
    setCarregando(true);

    try {
      const dados = await auditoriaComprasService.buscarHistoricoDetalhado();
      setHistoricoTransacoes(dados);
    } catch {
      setHistoricoTransacoes([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const comprasAgrupadas = useMemo(
    () => agruparComprasAuditaveis(historicoTransacoes),
    [historicoTransacoes],
  );

  const comprasFiltradas = useMemo(
    () => filtrarComprasAuditaveis(comprasAgrupadas, filtros),
    [comprasAgrupadas, filtros],
  );

  const resumo = useMemo(
    () => calcularResumoAuditoria(comprasFiltradas),
    [comprasFiltradas],
  );

  const baixarCSV = useCallback(() => {
    if (comprasFiltradas.length === 0) return;

    const blob = new Blob(
      ["\uFEFF" + criarCsvAuditoriaCompras(comprasFiltradas)],
      {
        type: "text/csv;charset=utf-8;",
      },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Auditoria_Compras_${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [comprasFiltradas]);

  const abrirComprovante = useCallback((compra: CompraAuditavel) => {
    if (compra.comprovante_url) {
      setComprovanteUrl(compra.comprovante_url);
    }
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros(FILTROS_AUDITORIA_COMPRAS_VAZIOS);
  }, []);

  return {
    carregando,
    filtros,
    comprasFiltradas,
    resumo,
    compraSelecionada,
    compraEdicao,
    comprovanteUrl,
    filtrosAtivos: filtrosAuditoriaAtivos(filtros),
    possuiResultados: comprasFiltradas.length > 0,
    setFiltros,
    limparFiltros,
    baixarCSV,
    abrirComprovante,
    fecharComprovante: () => setComprovanteUrl(null),
    abrirDetalhes: setCompraSelecionada,
    fecharDetalhes: () => setCompraSelecionada(null),
    abrirEdicao: setCompraEdicao,
    fecharEdicao: () => setCompraEdicao(null),
    carregarHistorico,
  };
}
