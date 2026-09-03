import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  montarDadosDesempenho,
  RESUMO_GERAL_DESEMPENHO_VAZIO,
} from "../utils/desempenhoDataUtils";
import { desempenhoService } from "../services/desempenhoService";

export function useDesempenhoController() {
  const queryClient = useQueryClient();

  const { data, isLoading: carregando, error } = useQuery({
    queryKey: ["tesouraria", "desempenho"],
    queryFn: async () => {
      const [resultadoRelatorio, resultadoHistorico] = await Promise.allSettled([
        desempenhoService.buscarRelatorio(),
        desempenhoService.buscarHistoricoDetalhado(),
      ]);

      const resumoGeral =
        resultadoRelatorio.status === "fulfilled"
          ? resultadoRelatorio.value.resumoGeral
          : RESUMO_GERAL_DESEMPENHO_VAZIO;
      const aderidos =
        resultadoRelatorio.status === "fulfilled"
          ? resultadoRelatorio.value.aderidos
          : [];
      const historicoTransacoes =
        resultadoHistorico.status === "fulfilled"
          ? resultadoHistorico.value
          : [];

      // Se ambos falharem, jogamos um erro. Se um passar, mostramos o que deu.
      if (
        resultadoRelatorio.status === "rejected" &&
        resultadoHistorico.status === "rejected"
      ) {
        throw new Error("Erro ao carregar dados de desempenho.");
      }

      return { resumoGeral, aderidos, historicoTransacoes };
    },
    staleTime: 180_000,
  });

  const resumoGeral = data?.resumoGeral || RESUMO_GERAL_DESEMPENHO_VAZIO;
  const aderidos = data?.aderidos || [];
  const historicoTransacoes = data?.historicoTransacoes || [];
  const erro = error instanceof Error ? error.message : null;

  const carregarDados = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["tesouraria", "desempenho"] });
  }, [queryClient]);

  const dados = useMemo(
    () =>
      montarDadosDesempenho({
        resumoGeral,
        aderidos,
        historicoTransacoes,
      }),
    [aderidos, historicoTransacoes, resumoGeral],
  );

  return {
    dados,
    carregando,
    erro,
    carregarDados,
  };
}
