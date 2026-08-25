import { useCallback, useEffect, useMemo, useState } from "react";

import { useDebounce } from "@/shared/hooks/useDebounce";

import { pixTransacoesService } from "../services/pixTransacoesService";
import {
  PixTransacoesFiltros,
  PixTransacoesResumo,
  PixTransacao,
} from "../types/pixTransacoes";
import {
  calcularResumoPixTransacoes,
  filtrarPixTransacoes,
  RESUMO_PIX_TRANSACOES_VAZIO,
} from "../utils/pixTransacoesUtils";

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

    setTransacoes(dadosTransacoes);
    setResumo(
      resumoPossuiDados(dadosResumo)
        ? dadosResumo
        : calcularResumoPixTransacoes(dadosTransacoes),
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

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const debouncedBusca = useDebounce(filtros.busca, 250);

  const transacoesFiltradas = useMemo(() => {
    return filtrarPixTransacoes(transacoes, { ...filtros, busca: debouncedBusca });
  }, [transacoes, filtros, debouncedBusca]);

  return {
    transacoes,
    transacoesFiltradas,
    resumo,
    filtros,
    carregando,
    sincronizando,

    setFiltros,
    carregarDados,
    sincronizarBanco,
  };
}
