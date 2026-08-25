// ============================================================================
// ARQUIVO: backend/functions/src/modules/pagamentos/services/consultarCheckoutPixService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { PagamentoPix } from "../../types/models";
import { CheckoutPixResposta } from "../../rifas/types/rifasTypes";
import { obterContextoAderidoPorEmail } from "../../rifas/helpers/usuarioRifasHelper";

import { mapearStatusCheckoutPix } from "../helpers/checkoutPixHelper";

export class ConsultarCheckoutPixService {
  static async executar(
    emailLogado: string,
    pagamentoId: string,
  ): Promise<CheckoutPixResposta> {
    const db = admin.firestore();
    const contextoAderido = await obterContextoAderidoPorEmail(emailLogado);
    const snap = await db.collection("pagamentos_pix").doc(pagamentoId).get();

    if (!snap.exists) {
      throw new Error("PAGAMENTO_NOT_FOUND");
    }

    const pagamento = snap.data() as PagamentoPix;

    if (pagamento.vendedor_id !== contextoAderido.idAderido) {
      throw new Error("PAGAMENTO_NOT_FOUND");
    }

    return {
      id: pagamento.id,
      status: mapearStatusCheckoutPix(String(pagamento.status_pagamento_banco)),
      qrCodeImagemUrl: pagamento.qr_code_imagem_url || null,
      qrCodeBase64: pagamento.qr_code_base64 || null,
      copiaECola: pagamento.copia_e_cola || "",
      expiraEm: pagamento.data_expiracao || null,
    };
  }
}
