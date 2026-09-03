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
//   POST /tesouraria/checkout/pix
//   Body: { nome, telefone, email, numerosRifas }
//   Resposta: { id, status, qrCodeImagemUrl, qrCodeBase64, copiaECola, expiraEm }
// ============================================================================
import { fetchAPI } from "@/shared/services/api";

import {
  CheckoutPixCobranca,
  CheckoutPixStatus,
  CriarCobrancaPixParams,
} from "../types/checkoutPix";
import {
  sanitizarDadosCliente,
  sanitizarDocumento,
} from "@/shared/utils/sanitizadores";

let requisicaoEmAndamento = false;

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor : "";
}

function normalizarStatusCheckoutPix(status: unknown): CheckoutPixStatus {
  if (
    status === "aguardando_pagamento" ||
    status === "pago" ||
    status === "expirado" ||
    status === "cancelado"
  ) {
    return status;
  }

  return "aguardando_pagamento";
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
    status: normalizarStatusCheckoutPix(dados.status),
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
    const documento = sanitizarDocumento(params.documento);

    const numerosRifas = params.numerosRifas.filter(Boolean);

    if (!sanitizados.nome) throw new Error("Nome do comprador e obrigatorio.");
    if (!sanitizados.telefone) throw new Error("Telefone do comprador e obrigatorio.");
    if (!numerosRifas.length) {
      throw new Error("Selecione ao menos uma rifa para gerar o pagamento.");
    }

    requisicaoEmAndamento = true;

    try {
      const resposta = await fetchAPI("/tesouraria/checkout/pix", "POST", {
        nome: sanitizados.nome,
        telefone: sanitizados.telefone,
        email: sanitizados.email,
        documento,
        numerosRifas,
        sessaoCheckoutId: params.sessaoCheckoutId,
      });

      const cobranca = normalizarCobrancaPix(resposta);
      cobranca.numerosRifas = numerosRifas;
      return cobranca;
    } finally {
      requisicaoEmAndamento = false;
    }
  },



  // ------------------------------------------------------------------
  // Cancela uma cobranca Pix e libera as rifas.
  // ------------------------------------------------------------------
  async cancelarCobrancaPix(id: string, reterReserva: boolean = false) {
    await fetchAPI(`/tesouraria/checkout/pix/${id}/cancelar`, "POST", { reterReserva });
  },
};
