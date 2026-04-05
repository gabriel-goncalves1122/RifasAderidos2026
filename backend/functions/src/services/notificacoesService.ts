import * as admin from "firebase-admin";

export class NotificacoesService {
  static async buscarPorEmailAderido(email: string) {
    const db = admin.firestore();

    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (userDocs.empty) return [];

    const idAderido = userDocs.docs[0].data().id_aderido;

    const snap = await db
      .collection("notificacoes")
      .where("vendedor_id", "==", idAderido)
      .orderBy("data_criacao", "desc")
      .limit(20)
      .get();

    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async marcarComoLidas(ids: string[]) {
    const db = admin.firestore();
    const batch = db.batch();

    ids.forEach((id) => {
      batch.update(db.collection("notificacoes").doc(id), { lida: true });
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
    batch.set(notificacaoRef, {
      vendedor_id: vendedorId,
      titulo: "Comprovante Recusado ⚠️",
      mensagem:
        motivo || "O comprovante enviado não foi aceito pela tesouraria.",
      rifas: numerosRifas,
      lida: false,
      data_criacao: new Date().toISOString(),
    });
  }
}
