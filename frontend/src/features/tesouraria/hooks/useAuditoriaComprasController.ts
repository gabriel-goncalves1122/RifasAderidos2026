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
  normalizarTexto,
} from "../utils/auditoriaComprasUtils";
import { sanitizarDadosCliente } from "@/shared/utils/sanitizadores";
import { auditoriaComprasService } from "../services/auditoriaComprasService";

interface DadosEdicaoComprador {
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

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
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);
  const [reenviandoEmailComprovanteId, setReenviandoEmailComprovanteId] =
    useState<string | null>(null);
  const [feedbackEmailComprovante, setFeedbackEmailComprovante] = useState<{
    tipo: "success" | "error";
    mensagem: string;
  } | null>(null);

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

  const abrirEdicao = useCallback((compra: CompraAuditavel) => {
    setErroEdicao(null);
    setCompraEdicao(compra);
  }, []);

  const fecharEdicao = useCallback(() => {
    if (salvandoEdicao) return;

    setErroEdicao(null);
    setCompraEdicao(null);
  }, [salvandoEdicao]);

  const salvarEdicaoComprador = useCallback(
    async (dados: DadosEdicaoComprador) => {
      if (!compraEdicao?.comprador_id) {
        setErroEdicao("Compra sem comprador_id não pode ser editada.");
        return false;
      }

      setSalvandoEdicao(true);
      setErroEdicao(null);

      try {
        const dadosSanitizados = sanitizarDadosCliente({
          nome: dados.nome,
          email: dados.email || "",
          telefone: dados.telefone || "",
        });

        await auditoriaComprasService.atualizarComprador(
          compraEdicao.comprador_id,
          dadosSanitizados,
        );
        setCompraEdicao(null);
        await carregarHistorico();

        return true;
      } catch (error: any) {
        setErroEdicao(
          error?.message || "Erro ao salvar dados do comprador.",
        );

        return false;
      } finally {
        setSalvandoEdicao(false);
      }
    },
    [carregarHistorico, compraEdicao],
  );

  const reenviarEmailComprovante = useCallback(async (compra: CompraAuditavel) => {
    if (!compra.comprador_id) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "Compra sem comprador_id não permite reenvio.",
      });
      return false;
    }

    if (normalizarTexto(compra.status) !== "pago") {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "O reenvio está disponível apenas para compras pagas.",
      });
      return false;
    }

    if (!compra.comprador_email.trim()) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "A compra não possui e-mail do comprador.",
      });
      return false;
    }

    setReenviandoEmailComprovanteId(compra.comprador_id);
    setFeedbackEmailComprovante(null);

    try {
      const resposta = await auditoriaComprasService.reenviarEmailComprovante(
        compra.comprador_id,
      );

      setFeedbackEmailComprovante({
        tipo: "success",
        mensagem:
          resposta?.mensagem || "E-mail de comprovante reenviado.",
      });

      return true;
    } catch (error: any) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem:
          error?.message || "Erro ao reenviar e-mail de comprovante.",
      });

      return false;
    } finally {
      setReenviandoEmailComprovanteId(null);
    }
  }, []);

  return {
    carregando,
    filtros,
    comprasFiltradas,
    resumo,
    compraSelecionada,
    compraEdicao,
    comprovanteUrl,
    salvandoEdicao,
    erroEdicao,
    reenviandoEmailComprovanteId,
    feedbackEmailComprovante,
    filtrosAtivos: filtrosAuditoriaAtivos(filtros),
    possuiResultados: comprasFiltradas.length > 0,
    setFiltros,
    limparFiltros,
    baixarCSV,
    abrirComprovante,
    fecharComprovante: () => setComprovanteUrl(null),
    abrirDetalhes: setCompraSelecionada,
    fecharDetalhes: () => setCompraSelecionada(null),
    abrirEdicao,
    fecharEdicao,
    salvarEdicaoComprador,
    reenviarEmailComprovante,
    fecharFeedbackEmailComprovante: () => setFeedbackEmailComprovante(null),
    carregarHistorico,
  };
}
