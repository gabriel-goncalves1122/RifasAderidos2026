import { fetchAPI } from "@/shared/services/api";

import {
  PixTransacoesResumo,
  PixTransacao,
} from "../types/pixTransacoes";
import { RESUMO_PIX_TRANSACOES_VAZIO } from "../utils/pixTransacoesUtils";

function valorNumericoSeguro(valor: unknown) {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : 0;
}

function normalizarTransacoes(resposta: unknown): PixTransacao[] {
  if (!resposta || typeof resposta !== "object") return [];

  const { transacoes } = resposta as { transacoes?: unknown };

  return Array.isArray(transacoes) ? (transacoes as PixTransacao[]) : [];
}

function normalizarResumo(resposta: unknown): PixTransacoesResumo {
  if (!resposta || typeof resposta !== "object") {
    return RESUMO_PIX_TRANSACOES_VAZIO;
  }

  const { resumo } = resposta as { resumo?: Partial<PixTransacoesResumo> };

  if (!resumo || typeof resumo !== "object") {
    return RESUMO_PIX_TRANSACOES_VAZIO;
  }

  return {
    totalRecebido: valorNumericoSeguro(resumo.totalRecebido),
    totalPendente: valorNumericoSeguro(resumo.totalPendente),
    totalCancelado: valorNumericoSeguro(resumo.totalCancelado),
    totalDivergente: valorNumericoSeguro(resumo.totalDivergente),
    quantidadePagas: valorNumericoSeguro(resumo.quantidadePagas),
    quantidadeAguardando: valorNumericoSeguro(resumo.quantidadeAguardando),
    quantidadeCanceladas: valorNumericoSeguro(resumo.quantidadeCanceladas),
    quantidadeNaoIdentificadas: valorNumericoSeguro(
      resumo.quantidadeNaoIdentificadas,
    ),
    ticketMedio: valorNumericoSeguro(resumo.ticketMedio),
  };
}

export const pixTransacoesService = {
  async buscarTransacoes() {
    const resposta = await fetchAPI("/tesouraria/transacoes-bancarias");

    return normalizarTransacoes(resposta);
  },

  async buscarResumo() {
    const resposta = await fetchAPI("/tesouraria/transacoes-bancarias/resumo");

    return normalizarResumo(resposta);
  },

  async sincronizarBanco() {
    return fetchAPI("/tesouraria/transacoes-bancarias/sincronizar", "POST");
  },
};
