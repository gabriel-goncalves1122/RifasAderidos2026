import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

import { PagamentoPix } from "../../types/models";
import {
  extrairPagoEmMercadoPago,
  extrairStatusPagamentoMercadoPago,
  extrairValorPagoReaisMercadoPago,
  liberarBilhetesNaTransacao,
} from "./checkoutPixHelper";

function obterMotivoFalhaBanco(payload: any) {
  return payload?.status_detail || "Pagamento não confirmado pelo banco.";
}

export async function aprovarOuRejeitarPixNoFirestore(
  db: admin.firestore.Firestore,
  payload: any
) {
  const orderId = String(payload.id).trim();

  const statusBanco = extrairStatusPagamentoMercadoPago(payload);
  const pagoEm = extrairPagoEmMercadoPago(payload);
  const valorPago = extrairValorPagoReaisMercadoPago(payload);

  return await db.runTransaction(async (transaction) => {
    // 1. Busca do pagamento (query) DENTRO da transação
    const querySnap = await transaction.get(
      db.collection("pagamentos_pix").where("pix_order_id", "==", orderId).limit(1)
    );

    if (querySnap.empty) {
      throw new Error("PAGAMENTO_NOT_FOUND");
    }

    const pagamentoRef = querySnap.docs[0].ref;
    const pagamento = querySnap.docs[0].data() as PagamentoPix;

    if (pagamento.status_pagamento_banco === statusBanco) {
      transaction.set(pagamentoRef, { raw_mercadopago: payload }, { merge: true });

      return {
        sucesso: true,
        idempotente: true,
        status: statusBanco,
      };
    }

    const dadosPagamento: Partial<PagamentoPix> = {
      pix_order_id: String(payload?.id || pagamento.pix_order_id || pagamento.id),
      status_pagamento_banco: statusBanco,
      valor_pago: valorPago || pagamento.valor_pago || 0,
      data_pagamento: pagoEm || pagamento.data_pagamento || null,
      raw_mercadopago: payload,
    };

    if (["approved", "authorized"].includes(statusBanco)) {
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
          },
          { merge: true },
        );
      });
    }

    if (["rejected", "cancelled", "refunded"].includes(statusBanco)) {
      if (pagamento.status_validacao === "aceita") {
        return {
          sucesso: true,
          idempotente: true,
          status: statusBanco,
          mensagem: "Ignorado webhook tardio de cancelamento para pagamento já validado pela tesouraria.",
        };
      }

      const motivo = obterMotivoFalhaBanco(payload);

      // Usar helper para liberar os bilhetes, limpando os dados com delete()
      await liberarBilhetesNaTransacao(
        transaction,
        db,
        FieldValue.delete(),
        pagamento.numeros_rifas || [],
        statusBanco,
        motivo
      );

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

    transaction.set(pagamentoRef, dadosPagamento, { merge: true });

    return {
      sucesso: true,
      idempotente: false,
      status: statusBanco,
    };
  });
}
