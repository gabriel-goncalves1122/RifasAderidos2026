import * as admin from "firebase-admin";

export class NotificacoesService {
  static async buscarPorEmailAderido(email: string) {
    const db = admin.firestore();

    // 1. Busca o usuário com segurança
    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userDocs.empty) return [];

    const userData = userDocs.docs[0].data();

    // 2. CORREÇÃO: O banco antigo pode não ter 'id_aderido'
    // Se não houver id_aderido, usamos o ID do próprio documento como fallback
    const idBusca = userData.id_aderido || userDocs.docs[0].id;

    if (!idBusca) return [];

    try {
      const snap = await db
        .collection("notificacoes")
        .where("vendedor_id", "==", idBusca)
        .orderBy("data_criacao", "desc")
        .limit(20)
        .get();

      return (
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) || []
      ); // Garante retorno de array mesmo se algo der errado no map
    } catch (error) {
      console.error(
        "Erro ao buscar notificações (Provável falta de índice ou campo):",
        error,
      );
      // Se o orderBy falhar por falta de índice em produção, tentamos sem o orderBy para não crashar a tela
      const snapFallback = await db
        .collection("notificacoes")
        .where("vendedor_id", "==", idBusca)
        .limit(20)
        .get();

      return snapFallback.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  }

  static async marcarComoLidas(ids: string[]) {
    // Se não vier IDs, sai fora para não dar erro de batch vazio
    if (!ids || ids.length === 0) return;

    const db = admin.firestore();
    const batch = db.batch();

    ids.forEach((id) => {
      if (id) {
        // Proteção contra IDs nulos/undefined
        batch.update(db.collection("notificacoes").doc(id), { lida: true });
      }
    });

    await batch.commit();
  }

  static criarNotificacaoRecusa(
    batch: admin.firestore.WriteBatch,
    vendedorId: string,
    motivo: string,
    numerosRifas: string[],
  ) {
    const db = admin.firestore();
    const notificacaoRef = db.collection("notificacoes").doc();

    // Proteção: Garante que vendedorId existe para não criar lixo no banco
    if (!vendedorId) return;

    batch.set(notificacaoRef, {
      vendedor_id: vendedorId,
      titulo: "Comprovante Recusado ⚠️",
      mensagem:
        motivo || "O comprovante enviado não foi aceito pela tesouraria.",
      rifas: numerosRifas || [], // Fallback para array vazio
      lida: false,
      data_criacao: new Date().toISOString(),
    });
  }
}
