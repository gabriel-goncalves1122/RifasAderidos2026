import { fetchAPI } from "@/shared/services/api";

import { TransacaoAuditoriaComprasBase } from "../types/auditoriaCompras";

export interface DadosAtualizacaoCompradorAuditoria {
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

export interface ResultadoReenvioEmailComprovanteAuditoria {
  comprador_id: string;
  email: string;
  rifas: string[];
  status: "aprovado";
}

function normalizarListaHistorico(valor: unknown): TransacaoAuditoriaComprasBase[] {
  if (Array.isArray(valor)) return valor as TransacaoAuditoriaComprasBase[];

  if (!valor || typeof valor !== "object") return [];

  return Object.values(valor).filter(
    (item): item is TransacaoAuditoriaComprasBase =>
      Boolean(item) && typeof item === "object",
  );
}

function normalizarHistorico(resposta: unknown): TransacaoAuditoriaComprasBase[] {
  if (!resposta || typeof resposta !== "object") return [];

  if (Array.isArray(resposta)) {
    return normalizarListaHistorico(resposta);
  }

  if ("historico" in resposta) {
    return normalizarListaHistorico(
      (resposta as { historico?: unknown }).historico,
    );
  }

  return normalizarListaHistorico(resposta);
}

export const auditoriaComprasService = {
  async buscarHistoricoDetalhado() {
    const resposta = await fetchAPI("/rifas/historico");

    return normalizarHistorico(resposta);
  },

  async atualizarComprador(
    compradorId: string,
    dados: DadosAtualizacaoCompradorAuditoria,
  ) {
    return fetchAPI(
      `/tesouraria/historico/compras/${encodeURIComponent(compradorId)}`,
      "PATCH",
      dados,
    );
  },

  async reenviarEmailComprovante(compradorId: string) {
    return fetchAPI(
      `/tesouraria/historico/compras/${encodeURIComponent(
        compradorId,
      )}/reenviar-email-comprovante`,
      "POST",
    ) as Promise<{
      sucesso: true;
      mensagem: string;
      envio: ResultadoReenvioEmailComprovanteAuditoria;
    }>;
  },
};
