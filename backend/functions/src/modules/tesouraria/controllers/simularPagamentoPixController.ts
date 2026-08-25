// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/simularPagamentoPixController.ts
// ============================================================================
import { Request, Response } from "express";
import * as admin from "firebase-admin";

export async function simularPagamentoPix(req: Request, res: Response) {
  try {
    const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
    if (!isEmulator) {
      return res.status(403).json({ error: "Endpoint disponível apenas em ambiente de desenvolvimento." });
    }

    const id = String(req.params.id || "");
    if (!id) {
      return res.status(400).json({ error: "ID do pagamento obrigatório." });
    }

    const db = admin.firestore();
    const pagamentoRef = db.collection("pagamentos_pix").doc(id);

    await db.runTransaction(async (transaction) => {
      const snap = await transaction.get(pagamentoRef);
      if (!snap.exists) {
        throw new Error("PAGAMENTO_NOT_FOUND");
      }

      const dados = snap.data();
      const numerosRifas = dados?.numeros_rifas || [];
      const valorBruto = dados?.valor_bruto || 0;
      const agora = new Date().toISOString();

      // Atualiza pagamento
      transaction.update(pagamentoRef, {
        status_pagamento_banco: "PAID",
        valor_pago: valorBruto,
        data_pagamento: agora,
      });

      // Atualiza os bilhetes
      for (const numero of numerosRifas) {
        transaction.update(db.collection("bilhetes").doc(numero), {
          status: "pendente",
          status_pagamento_banco: "PAID",
          valor_pago: numerosRifas.length > 0 ? valorBruto / numerosRifas.length : 0,
          data_pagamento: agora,
        });
      }
    });

    return res.status(200).json({ message: "Pagamento simulado com sucesso." });
  } catch (error: any) {
    if (error.message === "PAGAMENTO_NOT_FOUND") {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }

    console.error("[SimularPagamentoPix] Erro:", error);
    return res.status(500).json({ error: "Erro ao simular pagamento." });
  }
}
