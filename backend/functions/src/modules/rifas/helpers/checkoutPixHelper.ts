// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/helpers/checkoutPixHelper.ts
// ============================================================================
import crypto from "crypto";

import {
  CheckoutPixResposta,
  CheckoutPixStatus,
  CriarCheckoutPixPayload,
} from "../types/rifasTypes";

export const VALOR_RIFA_REAIS = 10;

export interface CheckoutPixDadosNormalizados {
  nome: string;
  telefone: string;
  email?: string;
  documento?: string;
  numerosRifas: string[];
}

export interface PagBankQrCodeNormalizado {
  id: string;
  copiaECola: string;
  expiraEm?: string | null;
  qrCodeImagemUrl?: string | null;
  qrCodeBase64?: string | null;
}

export function somenteNumeros(valor?: string | null) {
  return String(valor || "").replace(/\D/g, "");
}

export function normalizarNumerosRifas(valor: unknown) {
  if (!Array.isArray(valor)) return [];

  return Array.from(
    new Set(
      valor
        .map((numero) => String(numero || "").trim())
        .filter((numero) => numero.length > 0),
    ),
  );
}

export function normalizarDadosCheckoutPix(
  payload: CriarCheckoutPixPayload,
): CheckoutPixDadosNormalizados {
  const nome = String(payload?.nome || "").trim();
  const telefone = somenteNumeros(payload?.telefone);
  const email = String(payload?.email || "").trim();
  const documento = somenteNumeros(payload?.documento);
  const numerosRifas = normalizarNumerosRifas(payload?.numerosRifas);

  if (!nome || !telefone || numerosRifas.length === 0) {
    throw new Error("INVALID_DATA");
  }

  return {
    nome,
    telefone,
    email: email || undefined,
    documento: documento || undefined,
    numerosRifas,
  };
}

export function calcularValorPixReais(numerosRifas: string[]) {
  return numerosRifas.length * VALOR_RIFA_REAIS;
}

export function calcularValorPixCentavos(numerosRifas: string[]) {
  return calcularValorPixReais(numerosRifas) * 100;
}

export function dataExpiracaoPix(dataBase = new Date()) {
  const expiraEm = new Date(dataBase);

  expiraEm.setHours(expiraEm.getHours() + 24);

  return expiraEm.toISOString();
}

export function montarReferenceIdPix(compradorId: string) {
  return `rifas-pix-${compradorId}`;
}

function obterLinkQrCode(
  qrCode: Record<string, any>,
  media: "image/png" | "text/plain",
) {
  const links = Array.isArray(qrCode.links) ? qrCode.links : [];
  const link = links.find((item) => item?.media === media);

  return typeof link?.href === "string" ? link.href : null;
}

export function normalizarQrCodePagBank(resposta: any): PagBankQrCodeNormalizado {
  const qrCode = Array.isArray(resposta?.qr_codes)
    ? resposta.qr_codes[0]
    : undefined;
  const id = String(qrCode?.id || "").trim();
  const copiaECola = String(qrCode?.text || "").trim();

  if (!id || !copiaECola) {
    throw new Error("PAGBANK_QR_CODE_INVALIDO");
  }

  return {
    id,
    copiaECola,
    expiraEm: qrCode?.expiration_date || null,
    qrCodeImagemUrl: obterLinkQrCode(qrCode, "image/png"),
    qrCodeBase64: null,
  };
}

export function mapearStatusCheckoutPix(status: string): CheckoutPixStatus {
  if (["PAID", "AUTHORIZED"].includes(status)) return "pago";
  if (["DECLINED", "CANCELED"].includes(status)) return "cancelado";

  return "aguardando_pagamento";
}

export function montarRespostaCheckoutPix(params: {
  id: string;
  status: string;
  qrCode: PagBankQrCodeNormalizado;
}): CheckoutPixResposta {
  return {
    id: params.id,
    status: mapearStatusCheckoutPix(params.status),
    qrCodeImagemUrl: params.qrCode.qrCodeImagemUrl,
    qrCodeBase64: params.qrCode.qrCodeBase64,
    copiaECola: params.qrCode.copiaECola,
    expiraEm: params.qrCode.expiraEm,
  };
}

export function extrairStatusPagamentoPagBank(payload: any) {
  const charge = Array.isArray(payload?.charges) ? payload.charges[0] : null;
  const status = String(charge?.status || payload?.status || "WAITING").trim();

  return status || "WAITING";
}

export function extrairValorPagoReaisPagBank(payload: any) {
  const charge = Array.isArray(payload?.charges) ? payload.charges[0] : null;
  const valor =
    charge?.amount?.summary?.paid ??
    charge?.amount?.value ??
    payload?.amount?.summary?.paid ??
    payload?.amount?.value;

  return Number.isFinite(Number(valor)) ? Number(valor) / 100 : 0;
}

export function extrairPagoEmPagBank(payload: any) {
  const charge = Array.isArray(payload?.charges) ? payload.charges[0] : null;

  return charge?.paid_at || payload?.paid_at || null;
}

export function calcularAssinaturaWebhook(rawBody: string, token: string) {
  return crypto
    .createHmac("sha256", token)
    .update(rawBody, "utf8")
    .digest("base64");
}

export function validarAssinaturaWebhookPix(params: {
  rawBody: string;
  token: string;
  assinaturaRecebida?: string;
}) {
  const assinatura = String(params.assinaturaRecebida || "").trim();

  if (!params.token || !params.rawBody || !assinatura) return false;

  const calculada = calcularAssinaturaWebhook(params.rawBody, params.token);
  const bufferCalculada = Buffer.from(calculada, "base64");
  const bufferRecebida = Buffer.from(assinatura, "base64");

  return (
    bufferCalculada.length === bufferRecebida.length &&
    crypto.timingSafeEqual(bufferCalculada, bufferRecebida)
  );
}

