
import { useCallback, useEffect, useMemo, useState } from "react";

import { pixTransacoesMock } from "../mocks/pixTransacoesMock";
import { pixTransacoesService } from "../services/pixTransacoesService";
import {
  AcaoValidacaoPix,
  PixTransacoesFiltros,
  PixTransacoesResumo,
  PixTransacao,
  StatusValidacaoPix,
} from "../types/pixTransacoes";
import {
  calcularResumoPixTransacoes,
  filtrarPixTransacoes,
  RESUMO_PIX_TRANSACOES_VAZIO,
} from "../utils/pixTransacoesUtils";
import {
  aplicarResumoValidacaoPix,
  podeValidarPixTransacao,
} from "../utils/pixValidacaoUtils";

function resumoPossuiDados(resumo: PixTransacoesResumo | null) {
  if (!resumo) return false;

  return Object.values(resumo).some((valor) => valor > 0);
}

export function usePixTransacoes() {
  const [transacoes, setTransacoes] = useState<PixTransacao[]>([]);
  const [resumo, setResumo] =
    useState<PixTransacoesResumo>(RESUMO_PIX_TRANSACOES_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [validandoPixPorId, setValidandoPixPorId] = useState<
    Record<string, AcaoValidacaoPix | undefined>
  >({});
  const [erroValidacaoPixPorId, setErroValidacaoPixPorId] = useState<
    Record<string, string | undefined>
  >({});

  const [filtros, setFiltros] = useState<PixTransacoesFiltros>({
    status: "todas",
    busca: "",
  });

  const carregarDados = useCallback(async () => {
    setCarregando(true);

    const [resultadoTransacoes, resultadoResumo] = await Promise.allSettled([
      pixTransacoesService.buscarTransacoes(),
      pixTransacoesService.buscarResumo(),
    ]);

    const dadosTransacoes =
      resultadoTransacoes.status === "fulfilled"
        ? resultadoTransacoes.value
        : [];
    const dadosResumo =
      resultadoResumo.status === "fulfilled" ? resultadoResumo.value : null;

    const deveUsarMockLocal = import.meta.env.DEV && dadosTransacoes.length === 0;

    const transacoesBase = deveUsarMockLocal
      ? pixTransacoesMock
      : dadosTransacoes;

    setTransacoes(transacoesBase);
    setResumo(
      !deveUsarMockLocal && resumoPossuiDados(dadosResumo)
        ? dadosResumo
        : calcularResumoPixTransacoes(transacoesBase),
    );
    setCarregando(false);
  }, []);

  const sincronizarBanco = async () => {
    setSincronizando(true);

    try {
      await pixTransacoesService.sincronizarBanco();
      await carregarDados();
    } finally {
      setSincronizando(false);
    }
  };

  const transacoesComValidacao = transacoes;

  const resumoComValidacao = useMemo(
    () => aplicarResumoValidacaoPix(resumo, transacoesComValidacao),
    [resumo, transacoesComValidacao],
  );

  const aplicarValidacaoLocal = useCallback(
    async (transacaoId: string, statusValidacao: StatusValidacaoPix) => {
      const transacao = transacoesComValidacao.find(
        (item) => item.id === transacaoId,
      );

      if (!transacao || !podeValidarPixTransacao(transacao)) {
        setErroValidacaoPixPorId((estadoAtual) => ({
          ...estadoAtual,
          [transacaoId]:
            "A validação Pix só fica disponível após confirmação bancária.",
        }));
        return false;
      }

      const acao: AcaoValidacaoPix =
        statusValidacao === "aceita" ? "aceitar" : "negar";

      setErroValidacaoPixPorId((estadoAtual) => ({
        ...estadoAtual,
        [transacaoId]: undefined,
      }));
      setValidandoPixPorId((estadoAtual) => ({
        ...estadoAtual,
        [transacaoId]: acao,
      }));

      try {
        if (statusValidacao === "aceita") {
          await pixTransacoesService.aceitarTransacao(transacaoId);
        } else {
          await pixTransacoesService.negarTransacao(
            transacaoId,
            "Dados incorretos informados pelo comprador.",
          );
        }

        await carregarDados();
        return true;
      } catch (error: any) {
        setErroValidacaoPixPorId((estadoAtual) => ({
          ...estadoAtual,
          [transacaoId]:
            error?.message || "Erro ao validar transação Pix.",
        }));
        return false;
      } finally {
        setValidandoPixPorId((estadoAtual) => ({
          ...estadoAtual,
          [transacaoId]: undefined,
        }));
      }
    },
    [carregarDados, transacoesComValidacao],
  );

  const aceitarPixTransacao = useCallback(
    (transacaoId: string) => aplicarValidacaoLocal(transacaoId, "aceita"),
    [aplicarValidacaoLocal],
  );

  const negarPixTransacao = useCallback(
    (transacaoId: string) => aplicarValidacaoLocal(transacaoId, "negada"),
    [aplicarValidacaoLocal],
  );

  const limparErroValidacaoPix = useCallback((transacaoId: string) => {
    setErroValidacaoPixPorId((estadoAtual) => ({
      ...estadoAtual,
      [transacaoId]: undefined,
    }));
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const transacoesFiltradas = useMemo(() => {
    return filtrarPixTransacoes(transacoesComValidacao, filtros);
  }, [transacoesComValidacao, filtros]);

  return {
    transacoes: transacoesComValidacao,
    transacoesFiltradas,
    resumo: resumoComValidacao,
    filtros,
    carregando,
    sincronizando,
    validandoPixPorId,
    erroValidacaoPixPorId,

    setFiltros,
    carregarDados,
    sincronizarBanco,
    aceitarPixTransacao,
    negarPixTransacao,
    limparErroValidacaoPix,
  };
}
