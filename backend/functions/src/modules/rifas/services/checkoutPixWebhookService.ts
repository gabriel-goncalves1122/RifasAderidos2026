// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/checkoutPixWebhookService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { PagamentoPix } from "../../types/models";
import {
  extrairPagoEmPagBank,
  extrairStatusPagamentoPagBank,
  extrairValorPagoReaisPagBank,
  validarAssinaturaWebhookPix,
} from "../helpers/checkoutPixHelper";

interface ProcessarWebhookParams {
  payload: any;
  rawBody: string;
  assinatura?: string;
}

async function buscarRefPagamentoPorWebhook(
  db: admin.firestore.Firestore,
  payload: any,
): Promise<admin.firestore.DocumentReference | null> {
  const orderId = String(payload?.id || "").trim();
  const referenceId = String(payload?.reference_id || "").trim();

  if (orderId) {
    const ref = db.collection("pagamentos_pix").doc(orderId);
    const snap = await ref.get();

    if (snap.exists) return ref;
  }

  if (!referenceId) return null;

  const snap = await db
    .collection("pagamentos_pix")
    .where("reference_id", "==", referenceId)
    .limit(1)
    .get();

  return snap.empty ? null : snap.docs[0].ref;
}

function obterMotivoFalhaBanco(payload: any) {
  const charge = Array.isArray(payload?.charges) ? payload.charges[0] : null;

  return (
    charge?.payment_response?.message ||
    payload?.payment_response?.message ||
    "Pagamento não confirmado pelo banco."
  );
}

export class CheckoutPixWebhookService {
  static async processarPayloadConfiavel(payload: any) {
    return aplicarPayloadBanco(payload);
  }

  static async processarWebhook(params: ProcessarWebhookParams) {
    const token = process.env.PAGBANK_WEBHOOK_TOKEN || "";
    const assinaturaValida = validarAssinaturaWebhookPix({
      rawBody: params.rawBody,
      token,
      assinaturaRecebida: params.assinatura,
    });

    if (!assinaturaValida) {
      throw new Error("INVALID_SIGNATURE");
    }

    return aplicarPayloadBanco(params.payload);
  }
}

async function aplicarPayloadBanco(payload: any) {
  const db = admin.firestore();
  const pagamentoRef = await buscarRefPagamentoPorWebhook(db, payload);

  if (!pagamentoRef) {
    throw new Error("PAGAMENTO_NOT_FOUND");
  }

  const statusBanco = extrairStatusPagamentoPagBank(payload);
  const pagoEm = extrairPagoEmPagBank(payload);
  const valorPago = extrairValorPagoReaisPagBank(payload);

  return await db.runTransaction(async (transaction) => {
    const pagamentoSnap = await transaction.get(pagamentoRef);

    if (!pagamentoSnap.exists) {
      throw new Error("PAGAMENTO_NOT_FOUND");
    }

    const pagamento = pagamentoSnap.data() as PagamentoPix;

    if (pagamento.status_pagamento_banco === statusBanco) {
      transaction.set(pagamentoRef, { raw_pagbank: payload }, { merge: true });

      return {
        sucesso: true,
        idempotente: true,
        status: statusBanco,
      };
    }

    const dadosPagamento: Partial<PagamentoPix> = {
      status_pagamento_banco: statusBanco,
      valor_pago: valorPago || pagamento.valor_pago || 0,
      data_pagamento: pagoEm || pagamento.data_pagamento || null,
      raw_pagbank: payload,
    };

    transaction.set(pagamentoRef, dadosPagamento, { merge: true });

    if (["PAID", "AUTHORIZED"].includes(statusBanco)) {
      pagamento.numeros_rifas.forEach((numero) => {
        transaction.set(
          db.collection("bilhetes").doc(numero),
          {
            status: "pendente",
            status_pagamento_banco: statusBanco,
            status_validacao: null,
            valor_pago:
              pagamento.numeros_rifas.length > 0
                ? (valorPago || pagamento.valor_bruto) /
                  pagamento.numeros_rifas.length
                : 0,
            data_pagamento: pagoEm || new Date().toISOString(),
            pix_order_id: pagamento.pix_order_id || pagamento.id,
            pix_charge_id: String(payload?.charges?.[0]?.id || "") || null,
          },
          { merge: true },
        );
      });
    }

    if (["DECLINED", "CANCELED"].includes(statusBanco)) {
      const motivo = obterMotivoFalhaBanco(payload);

      pagamento.numeros_rifas.forEach((numero) => {
        transaction.set(
          db.collection("bilhetes").doc(numero),
          {
            status: "disponivel",
            comprador_id: null,
            comprador_nome: null,
            vendedor_id: null,
            vendedor_nome: null,
            vendedor_cpf: null,
            data_reserva: null,
            data_expiracao: null,
            pix_order_id: null,
            pix_qr_code_id: null,
            pix_reference_id: null,
            pix_charge_id: null,
            status_pagamento_banco: statusBanco,
            status_validacao: null,
            valor_bruto: null,
            valor_pago: 0,
            motivo_recusa: motivo,
          },
          { merge: true },
        );
      });

      if (pagamento.vendedor_id) {
        const notificacaoRef = db.collection("notificacoes").doc();
        transaction.set(notificacaoRef, {
          vendedor_id: pagamento.vendedor_id,
          tipo: "rifa_liberada",
          titulo: "Rifas disponíveis novamente",
          mensagem:
            motivo || "O pagamento não foi confirmado pelo banco e as rifas voltaram para venda.",
          rifas: pagamento.numeros_rifas,
          lida: false,
          data_criacao: new Date().toISOString(),
        });
      }
    }

    return {
      sucesso: true,
      idempotente: false,
      status: statusBanco,
    };
  });
}
