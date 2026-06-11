// ============================================================================
// SERVICE: checkoutPixService
//
// Responsavel por criar cobrancas Pix via backend do sistema.
//
// O frontend NUNCA chama provedores financeiros diretamente.
// Toda a comunicacao com provedores externos (PagBank, etc.)
// e feita exclusivamente pelo backend das Firebase Functions.
//
// Contrato:
//   POST /rifas/checkout/pix
//   Body: { nome, telefone, email, numerosRifas }
//   Resposta: { id, status, qrCodeImagemUrl, qrCodeBase64, copiaECola, expiraEm }
// ============================================================================
import { fetchAPI } from "@/shared/services/api";

import {
  CheckoutPixCobranca,
  CriarCobrancaPixParams,
} from "../types/checkoutPix";
import { sanitizarDadosCliente } from "../utils/sanitizadores";

let requisicaoEmAndamento = false;

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor : "";
}

function normalizarCobrancaPix(resposta: unknown): CheckoutPixCobranca {
  if (!resposta || typeof resposta !== "object") {
    throw new Error("Resposta Pix invalida.");
  }

  const dados = resposta as Partial<CheckoutPixCobranca>;
  const id = normalizarTexto(dados.id);
  const copiaECola = normalizarTexto(dados.copiaECola);

  if (!id || !copiaECola) {
    throw new Error("Pagamento via Pix incompleto.");
  }

  return {
    id,
    status: dados.status || "aguardando_pagamento",
    qrCodeImagemUrl: dados.qrCodeImagemUrl || null,
    qrCodeBase64: dados.qrCodeBase64 || null,
    copiaECola,
    expiraEm: dados.expiraEm || null,
  };
}

export const checkoutPixService = {
  // ------------------------------------------------------------------
  // Cria uma cobranca Pix junto ao backend do sistema.
  //
  // Antes de chamar a API, sanitiza os dados de entrada usando
  // os sanitizadores compartilhados da feature.
  //
  // Um lock simples (mutex) impede requisicoes simultaneas.
  // ------------------------------------------------------------------
  async criarCobrancaPix(params: CriarCobrancaPixParams) {
    if (requisicaoEmAndamento) {
      throw new Error(
        "Ja existe uma cobranca sendo gerada. Aguarde a conclusao.",
      );
    }

    const sanitizados = sanitizarDadosCliente({
      nome: params.nome,
      telefone: params.telefone,
      email: params.email || "",
    });

    const numerosRifas = params.numerosRifas.filter(Boolean);

    if (!sanitizados.nome) throw new Error("Nome do comprador e obrigatorio.");
    if (!sanitizados.telefone) throw new Error("Telefone do comprador e obrigatorio.");
    if (!numerosRifas.length) {
      throw new Error("Selecione ao menos uma rifa para gerar o pagamento.");
    }

    requisicaoEmAndamento = true;

    try {
      const resposta = await fetchAPI("/rifas/checkout/pix", "POST", {
        nome: sanitizados.nome,
        telefone: sanitizados.telefone,
        email: sanitizados.email,
        numerosRifas,
      });

      return normalizarCobrancaPix(resposta);
    } finally {
      requisicaoEmAndamento = false;
    }
  },
};
