import { fetchAPI } from "@/shared/services/api";

import {
  CheckoutPixCobranca,
  CriarCobrancaPixParams,
} from "../types/checkoutPix";

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor : "";
}

function normalizarCobrancaPix(resposta: unknown): CheckoutPixCobranca {
  if (!resposta || typeof resposta !== "object") {
    throw new Error("Resposta Pix inválida.");
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
  async criarCobrancaPix(params: CriarCobrancaPixParams) {
    const resposta = await fetchAPI("/rifas/checkout/pix", "POST", {
      nome: params.nome,
      telefone: params.telefone,
      email: params.email || "",
      numerosRifas: params.numerosRifas,
    });

    return normalizarCobrancaPix(resposta);
  },
};
