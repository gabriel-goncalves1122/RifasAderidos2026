import * as admin from "firebase-admin";

import { PagamentoPix } from "../../types/models";
import { MercadoPagoPixClient } from "../../../shared/services/mercadoPagoPixClient";

export class CancelarCheckoutPixService {
  static async executar(uid: string, pagamentoId: string): Promise<void> {
    if (!uid || !pagamentoId) {
      throw new Error("UNAUTHORIZED");
    }

    const db = admin.firestore();
    const pagamentoRef = db.collection("pagamentos_pix").doc(pagamentoId);
    let orderIdParaCancelar = "";

    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(pagamentoRef);

      if (!snap.exists) {
        throw new Error("PAGAMENTO_NOT_FOUND");
      }

      const pagamento = snap.data() as PagamentoPix;

      if (pagamento.vendedor_id !== uid && pagamento.comprador_id !== uid) {
        throw new Error("UNAUTHORIZED");
      }

      const statusJaCancelados = ["CANCELADO", "cancelled", "canceled", "rejected", "declined", "ERRO_CRIACAO"];
      const statusValidosParaCancelar = ["WAITING", "CRIANDO"];
      
      if (statusJaCancelados.includes(String(pagamento.status_pagamento_banco))) {
        // Se já está cancelado (pelo webhook ou por erro anterior), consideramos sucesso.
        // Vamos retornar early para não fazer escrita redundante.
        return; 
      }

      if (!statusValidosParaCancelar.includes(String(pagamento.status_pagamento_banco))) {
        throw new Error("STATUS_INVALIDO_CANCELAMENTO");
      }

      // Prepara os bilhetes para reverter

      // Cancela o pagamento
      transaction.update(pagamentoRef, {
        status_pagamento_banco: "CANCELADO",
        erro_criacao: "Cancelado pelo usuário.",
      });

      // Libera as rifas
      const { liberarBilhetesNaTransacao } = require("../helpers/checkoutPixHelper");
      
      await liberarBilhetesNaTransacao(
        transaction,
        db,
        admin.firestore.FieldValue.delete(),
        pagamento.numeros_rifas || [],
        "CANCELADO",
        "Cancelado pelo usuário."
      );

      if (pagamento.idempotency_key) {
        const lockRef = db.collection("pagamentos_pix_idempotencia").doc(pagamento.idempotency_key);
        transaction.delete(lockRef);
      }

      orderIdParaCancelar = pagamento.pix_order_id || "";
    });

    // Fora da transação, tenta cancelar no Mercado Pago se houver orderId
    if (orderIdParaCancelar) {
      try {
        await MercadoPagoPixClient.cancelarPedidoPix(orderIdParaCancelar);
      } catch (error) {
        console.warn(`[CancelarCheckoutPixService] Erro ao cancelar no Mercado Pago (Order ${orderIdParaCancelar}):`, error);
        // Não quebramos o fluxo porque o banco de dados já foi revertido localmente.
      }
    }
  }
}
