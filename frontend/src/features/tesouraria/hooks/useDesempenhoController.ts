import { useCallback, useEffect, useMemo, useState } from "react";

import {
  montarDadosDesempenho,
  RESUMO_GERAL_DESEMPENHO_VAZIO,
} from "../utils/desempenhoDataUtils";
import {
  AderidoMetricaDesempenho,
  ResumoGeralDesempenho,
  TransacaoDesempenho,
} from "../types/desempenho";
import { desempenhoService } from "../services/desempenhoService";

export function useDesempenhoController() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [resumoGeral, setResumoGeral] = useState<ResumoGeralDesempenho>(
    RESUMO_GERAL_DESEMPENHO_VAZIO,
  );
  const [aderidos, setAderidos] = useState<AderidoMetricaDesempenho[]>([]);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<
    TransacaoDesempenho[]
  >([]);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    const [resultadoRelatorio, resultadoHistorico] = await Promise.allSettled([
      desempenhoService.buscarRelatorio(),
      desempenhoService.buscarHistoricoDetalhado(),
    ]);

    if (resultadoRelatorio.status === "fulfilled") {
      setResumoGeral(resultadoRelatorio.value.resumoGeral);
      setAderidos(resultadoRelatorio.value.aderidos);
    } else {
      setResumoGeral(RESUMO_GERAL_DESEMPENHO_VAZIO);
      setAderidos([]);
      setErro(resultadoRelatorio.reason?.message || "Erro ao carregar dados.");
    }

    if (resultadoHistorico.status === "fulfilled") {
      setHistoricoTransacoes(resultadoHistorico.value);
    } else {
      setHistoricoTransacoes([]);
      setErro(
        resultadoHistorico.reason?.message || "Erro ao carregar histórico.",
      );
    }

    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

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
