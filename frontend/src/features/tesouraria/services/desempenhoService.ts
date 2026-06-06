import { fetchAPI } from "@/shared/services/api";

import {
  AderidoMetricaDesempenho,
  ResumoGeralDesempenho,
  TransacaoDesempenho,
} from "../types/desempenho";
import { RESUMO_GERAL_DESEMPENHO_VAZIO } from "../utils/desempenhoDataUtils";

export interface RelatorioDesempenho {
  resumoGeral: ResumoGeralDesempenho;
  aderidos: AderidoMetricaDesempenho[];
}

function normalizarRelatorio(resposta: unknown): RelatorioDesempenho {
  if (!resposta || typeof resposta !== "object") {
    return {
      resumoGeral: RESUMO_GERAL_DESEMPENHO_VAZIO,
      aderidos: [],
    };
  }

  const relatorio = resposta as Partial<RelatorioDesempenho>;

  return {
    resumoGeral:
      relatorio.resumoGeral || RESUMO_GERAL_DESEMPENHO_VAZIO,
    aderidos: Array.isArray(relatorio.aderidos) ? relatorio.aderidos : [],
  };
}

function normalizarHistorico(resposta: unknown): TransacaoDesempenho[] {
  if (!resposta || typeof resposta !== "object") return [];

  const { historico } = resposta as { historico?: unknown };

  return Array.isArray(historico) ? (historico as TransacaoDesempenho[]) : [];
}

export const desempenhoService = {
  async buscarRelatorio() {
    const resposta = await fetchAPI("/rifas/relatorio");

    return normalizarRelatorio(resposta);
  },

  async buscarHistoricoDetalhado() {
    const resposta = await fetchAPI("/rifas/historico");

    return normalizarHistorico(resposta);
  },
};
