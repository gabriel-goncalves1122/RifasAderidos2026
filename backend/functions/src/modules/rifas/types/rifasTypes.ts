// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/types/rifasTypes.ts
// ============================================================================

export interface DadosVenda {
  nome: string;
  telefone: string;
  email?: string;
  numerosRifas: string[];
  comprovanteUrl: string;
}

export interface DadosCorrecaoRifas {
  nome: string;
  telefone: string;
  email: string;
  comprovanteUrl: string;
}

export interface DadosCorrecaoDadosRifas {
  nome: string;
  telefone: string;
  email?: string;
}

export interface CriarCheckoutPixPayload {
  nome: string;
  telefone: string;
  email?: string;
  documento?: string;
  numerosRifas: string[];
}

export type CheckoutPixStatus =
  | "aguardando_pagamento"
  | "pago"
  | "expirado"
  | "cancelado";

export interface CheckoutPixResposta {
  id: string;
  status: CheckoutPixStatus;
  qrCodeImagemUrl?: string | null;
  qrCodeBase64?: string | null;
  copiaECola: string;
  expiraEm?: string | null;
}

export interface AderidoRifasContexto {
  idAderido: string;
  vendedorNome: string;
  vendedorCpf: string;
}
