// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/services/checkoutPixWebhookService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { MercadoPagoPixClient } from "../../../shared/services/mercadoPagoPixClient";
import { aprovarOuRejeitarPixNoFirestore } from "../helpers/checkoutPixWebhookHelper";

interface ProcessarWebhookParams {
  payload: any;
  rawBody: string;
  assinatura?: string;
}

export class CheckoutPixWebhookService {
  static async processarWebhook(params: ProcessarWebhookParams) {
    const action = params.payload?.action || params.payload?.topic;
    const paymentId = params.payload?.data?.id || params.payload?.id;

    if (!paymentId) {
      // Ignora webhooks sem ID de pagamento
      return { sucesso: true, ignorado: true, motivo: "sem_payment_id" };
    }

    if (
      action !== "payment.updated" &&
      action !== "payment" &&
      params.payload?.type !== "payment"
    ) {
      return { sucesso: true, ignorado: true, motivo: "nao_e_payment_updated" };
    }

    // Validação segura: consultar o Mercado Pago usando o ID para obter o status real
    const pagamentoMP = await MercadoPagoPixClient.consultarPedido(paymentId);

    if (!pagamentoMP || !pagamentoMP.id) {
      return { sucesso: true, ignorado: true, motivo: "MERCADOPAGO_PAYMENT_NOT_FOUND" };
    }

    return CheckoutPixWebhookService.processarPayloadConfiavel(pagamentoMP);
  }

  static async processarPayloadConfiavel(payload: any) {
    const db = admin.firestore();
    return await aprovarOuRejeitarPixNoFirestore(db, payload);
  }
}


