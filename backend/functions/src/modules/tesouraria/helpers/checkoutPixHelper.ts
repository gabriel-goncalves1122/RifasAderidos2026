// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/helpers/checkoutPixHelper.ts
// ============================================================================
import crypto from "crypto";

import {
  CheckoutPixResposta,
  CheckoutPixStatus,
  CriarCheckoutPixPayload,
} from "../../rifas/types/rifasTypes";
import { Bilhete, Comprador, PagamentoPix } from "../../types/models";

export const VALOR_RIFA_REAIS = 10;

export interface CheckoutPixDadosNormalizados {
  nome: string;
  telefone: string;
  email?: string;
  documento?: string;
  numerosRifas: string[];
}

export interface MercadoPagoQrCodeNormalizado {
  id: string;
  copiaECola: string;
  expiraEm?: string | null;
  qrCodeImagemUrl?: string | null;
  qrCodeBase64?: string | null;
}

export const CHECKOUT_PIX_IDEMPOTENCIA_JANELA_MS = 5 * 60 * 1000;

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
  expiraEm.setMinutes(expiraEm.getMinutes() + 5);
  
  // Format to YYYY-MM-DDTHH:mm:ss.000-03:00 to avoid any timezone parsing bugs in Mercado Pago
  const ano = expiraEm.getFullYear();
  const mes = String(expiraEm.getMonth() + 1).padStart(2, "0");
  const dia = String(expiraEm.getDate()).padStart(2, "0");
  const hora = String(expiraEm.getHours()).padStart(2, "0");
  const min = String(expiraEm.getMinutes()).padStart(2, "0");
  const seg = String(expiraEm.getSeconds()).padStart(2, "0");
  
  const timezoneOffset = expiraEm.getTimezoneOffset();
  const offsetHours = String(Math.abs(Math.floor(timezoneOffset / 60))).padStart(2, "0");
  const offsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, "0");
  const sign = timezoneOffset > 0 ? "-" : "+";
  
  return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}.000${sign}${offsetHours}:${offsetMinutes}`;
}

export function montarReferenceIdPix(compradorId: string) {
  return `rifas-pix-${compradorId}`;
}

export function montarIdempotencyKeyPix(params: {
  vendedorId: string;
  numerosRifas: string[];
  dataBase?: Date;
}) {
  const janela = Math.floor(
    (params.dataBase || new Date()).getTime() /
      CHECKOUT_PIX_IDEMPOTENCIA_JANELA_MS,
  );
  const rifasOrdenadas = [...params.numerosRifas].sort().join(",");

  return crypto
    .createHash("sha256")
    .update(`${params.vendedorId}|${rifasOrdenadas}|${janela}`)
    .digest("hex");
}

export function normalizarQrCodeMercadoPago(resposta: any): MercadoPagoQrCodeNormalizado {
  const transactionData = resposta?.point_of_interaction?.transaction_data;
  const id = String(resposta?.id || "").trim();
  const copiaECola = String(transactionData?.qr_code || "").trim();

  if (!id || !copiaECola) {
    throw new Error("MERCADOPAGO_QR_CODE_INVALIDO");
  }

  return {
    id,
    copiaECola,
    expiraEm: resposta?.date_of_expiration || null,
    qrCodeImagemUrl: null, // MP usually gives base64
    qrCodeBase64: transactionData?.qr_code_base64 || null,
  };
}

export function mapearStatusCheckoutPix(status: string): CheckoutPixStatus {
  const s = String(status).toLowerCase();
  if (["approved", "authorized", "paid"].includes(s)) return "pago";
  if (["rejected", "cancelled", "canceled", "declined", "cancelado"].includes(s)) return "cancelado";

  return "aguardando_pagamento";
}

export function montarRespostaCheckoutPix(params: {
  id: string;
  status: string;
  qrCode: MercadoPagoQrCodeNormalizado;
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

export function extrairStatusPagamentoMercadoPago(payload: any) {
  const status = String(payload?.status || "pending").trim();
  return status || "pending";
}

export function extrairValorPagoReaisMercadoPago(payload: any) {
  const valor = payload?.transaction_details?.total_paid_amount ?? payload?.transaction_amount;
  return Number.isFinite(Number(valor)) ? Number(valor) : 0;
}

export function extrairPagoEmMercadoPago(payload: any) {
  return payload?.date_approved || payload?.last_updated || null;
}

export async function liberarBilhetesNaTransacao(
  transaction: any,
  db: any, // admin.firestore.Firestore
  FieldValueDelete: any, // admin.firestore.FieldValue.delete()
  numerosRifas: string[],
  statusBanco: string,
  motivo: string | null
) {
  if (!numerosRifas || numerosRifas.length === 0) return;

  const refs = numerosRifas.map((numero) => db.collection("bilhetes").doc(numero));
  await transaction.getAll(...refs);

  refs.forEach((ref) => {
    transaction.set(
      ref,
      {
        status: "disponivel",
        comprador_id: FieldValueDelete,
        comprador_nome: FieldValueDelete,
        comprador_email: FieldValueDelete,
        comprador_telefone: FieldValueDelete,
        vendedor_nome: FieldValueDelete,
        vendedor_cpf: FieldValueDelete,
        vendedor_id: FieldValueDelete,
        data_reserva: FieldValueDelete,
        data_expiracao: FieldValueDelete,
        pix_order_id: FieldValueDelete,
        pix_qr_code_id: FieldValueDelete,
        pix_reference_id: FieldValueDelete,
        status_pagamento_banco: statusBanco,
        status_validacao: FieldValueDelete,
        valor_bruto: FieldValueDelete,
        valor_pago: 0,
        motivo_recusa: motivo || FieldValueDelete,
      },
      { merge: true }
    );
  });
}

export function montarCompradorPix(
  compradorId: string,
  dados: CheckoutPixDadosNormalizados,
  agora: string,
): Comprador {
  return {
    id: compradorId,
    nome: dados.nome,
    telefone: dados.telefone,
    email: dados.email || null,
    criado_em: agora,
  };
}

export function montarPagamentoPix(params: {
  pagamentoId: string;
  compradorId: string;
  referenceId: string;
  idempotencyKey: string;
  contextoAderido: any;
  dados: CheckoutPixDadosNormalizados;
  valorBruto: number;
  agora: string;
  expiraEm: string;
}): PagamentoPix {
  return {
    id: params.pagamentoId,
    reference_id: params.referenceId,
    comprador_id: params.compradorId,
    vendedor_id: params.contextoAderido.idAderido,
    vendedor_nome: params.contextoAderido.vendedorNome,
    comprador_nome: params.dados.nome,
    comprador_email: params.dados.email || null,
    comprador_telefone: params.dados.telefone,
    comprador_documento: params.dados.documento || null,
    numeros_rifas: params.dados.numerosRifas,
    valor_bruto: params.valorBruto,
    valor_pago: 0,
    status_pagamento_banco: "CRIANDO",
    status_validacao: null,
    pix_order_id: null,
    pix_qr_code_id: null,
    copia_e_cola: null,
    qr_code_imagem_url: null,
    qr_code_base64: null,
    data_criacao: params.agora,
    data_expiracao: params.expiraEm,
    raw_mercadopago: null,
    idempotency_key: params.idempotencyKey,
  };
}

export function montarBilheteReservadoPix(params: {
  numero: string;
  compradorId: string;
  referenceId: string;
  contextoAderido: any;
  dados: CheckoutPixDadosNormalizados;
  valorRifa: number;
  agora: string;
  expiraEm: string;
}): Partial<Bilhete> {
  return {
    numero: params.numero,
    status: "reservado",
    comprador_id: params.compradorId,
    comprador_nome: params.dados.nome,
    comprador_email: params.dados.email || null,
    comprador_telefone: params.dados.telefone || null,
    vendedor_nome: params.contextoAderido.vendedorNome,
    vendedor_cpf: params.contextoAderido.vendedorCpf,
    vendedor_id: params.contextoAderido.idAderido,
    data_reserva: params.agora,
    data_expiracao: params.expiraEm,
    pix_order_id: null,
    pix_qr_code_id: null,
    pix_reference_id: params.referenceId,
    status_pagamento_banco: "CRIANDO",
    status_validacao: null,
    valor_bruto: params.valorRifa,
    valor_pago: 0,
  };
}
