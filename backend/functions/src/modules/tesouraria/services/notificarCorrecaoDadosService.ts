import * as admin from "firebase-admin";

import { Bilhete, Notificacao } from "../../types/models";

export class NotificarCorrecaoDadosService {
  static async notificar(compradorId: string, mensagem: string): Promise<void> {
    const db = admin.firestore();

    await db.runTransaction(async (transaction) => {
      const bilhetesSnap = await transaction.get(
        db.collection("bilhetes").where("comprador_id", "==", compradorId),
      );

      if (bilhetesSnap.empty) {
        throw new Error("COMPRA_NAO_ENCONTRADA");
      }

      const bilhetes = bilhetesSnap.docs.map((doc) => ({
        numero: doc.id,
        dados: doc.data() as Bilhete,
        ref: doc.ref,
      }));

      // Verifica se todos estão pagos (opcional dependendo da regra, mas geralmente sim)
      const todosPagos = bilhetes.every(
        ({ dados }) => (dados.status || "").toLowerCase().trim() === "pago",
      );

      if (!todosPagos) {
        throw new Error("COMPRA_NAO_PAGA");
      }

      const vendedorId = bilhetes.find(({ dados }) => dados.vendedor_id)?.dados
        .vendedor_id;

      if (!vendedorId) {
        throw new Error("VENDA_SEM_VENDEDOR");
      }

      const rifas = bilhetes
        .map(({ dados }) => dados.numero)
        .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

      // 1. Atualizar todos os bilhetes para correcao_pendente = true
      bilhetes.forEach(({ ref }) => {
        transaction.update(ref, { correcao_pendente: true });
      });

      // 2. Criar a notificação
      const novaNotificacao: Omit<Notificacao, "id"> = {
        vendedor_id: vendedorId,
        titulo: "Correção de Dados Solicitada",
        mensagem,
        rifas,
        tipo: "correcao_dados",
        lida: false,
        data_criacao: new Date().toISOString(),
      };

      const notifRef = db.collection("notificacoes").doc();
      transaction.set(notifRef, {
        ...novaNotificacao,
        id: notifRef.id,
      });
    });
  }
}
