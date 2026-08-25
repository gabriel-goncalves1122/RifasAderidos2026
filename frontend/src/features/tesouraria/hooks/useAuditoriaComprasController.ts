import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AuditoriaComprasFiltros,
  TransacaoTesouraria,
} from "../types/auditoriaCompras";
import {
  calcularResumoAuditoria,
  criarCsvAuditoriaCompras,
  FILTROS_AUDITORIA_COMPRAS_VAZIOS,
  filtrarComprasAuditaveis,
  filtrosAuditoriaAtivos,
  normalizarTexto,
} from "../utils/auditoriaComprasUtils";
import { sanitizarDadosCliente } from "@/shared/utils/sanitizadores";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { auditoriaComprasService } from "../services/auditoriaComprasService";

interface DadosEdicaoComprador {
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

export function useAuditoriaComprasController() {
  const [carregando, setCarregando] = useState(true);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<
    TransacaoTesouraria[]
  >([]);
  const [filtros, setFiltros] = useState<AuditoriaComprasFiltros>(
    FILTROS_AUDITORIA_COMPRAS_VAZIOS,
  );
  const [compraSelecionada, setCompraSelecionada] =
    useState<TransacaoTesouraria | null>(null);
  const [compraEdicao, setCompraEdicao] = useState<TransacaoTesouraria | null>(
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

  const debouncedBusca = useDebounce(filtros.busca, 250);

  const comprasFiltradas = useMemo(
    () => filtrarComprasAuditaveis(historicoTransacoes, { ...filtros, busca: debouncedBusca }),
    [historicoTransacoes, filtros, debouncedBusca],
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

  const abrirComprovante = useCallback((compra: TransacaoTesouraria) => {
    if (compra.comprovanteUrl) {
      setComprovanteUrl(compra.comprovanteUrl);
    }
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros(FILTROS_AUDITORIA_COMPRAS_VAZIOS);
  }, []);

  const abrirEdicao = useCallback((compra: TransacaoTesouraria) => {
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
      if (!compraEdicao?.compradorId) {
        setErroEdicao("Compra sem compradorId não pode ser editada.");
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
          compraEdicao.compradorId,
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

  const reenviarEmailComprovante = useCallback(async (compra: TransacaoTesouraria) => {
    if (!compra.compradorId) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "Compra sem compradorId não permite reenvio.",
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

    if (!compra.compradorEmail.trim()) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "A compra não possui e-mail do comprador.",
      });
      return false;
    }

    setReenviandoEmailComprovanteId(compra.compradorId);
    setFeedbackEmailComprovante(null);

    try {
      const resposta = await auditoriaComprasService.reenviarEmailComprovante(
        compra.compradorId,
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
