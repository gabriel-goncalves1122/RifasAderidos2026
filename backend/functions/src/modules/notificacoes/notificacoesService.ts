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

  static async marcarComoLidas(ids: string[], email: string) {
    // Se não vier IDs, sai fora para não dar erro de batch vazio
    if (!ids || ids.length === 0) return;

    const db = admin.firestore();

    // 1. Busca o usuário com segurança
    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userDocs.empty) return;
    const userData = userDocs.docs[0].data();
    const idBusca = userData.id_aderido || userDocs.docs[0].id;
    if (!idBusca) return;

    // 2. Busca todas as notificações para garantir que pertencem ao usuário (evitar IDOR)
    // Limite de 30 para evitar o limite do operador 'in' do Firestore (que permite até 30 na v2)
    // Se o frontend enviar mais de 30, pegaremos as 30 primeiras (normalmente são poucas).
    const idsSeguros = ids.slice(0, 30);
    const snap = await db
      .collection("notificacoes")
      .where(admin.firestore.FieldPath.documentId(), "in", idsSeguros)
      .where("vendedor_id", "==", idBusca)
      .get();

    if (snap.empty) return;

    const batch = db.batch();

    snap.docs.forEach((doc) => {
      batch.update(doc.ref, { lida: true });
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

  static criarNotificacaoCorrecaoDados(
    batch: admin.firestore.WriteBatch,
    vendedorId: string,
    motivo: string,
    numerosRifas: string[],
  ) {
    const db = admin.firestore();
    const notificacaoRef = db.collection("notificacoes").doc();

    if (!vendedorId) return;

    batch.set(notificacaoRef, {
      vendedor_id: vendedorId,
      tipo: "correcao_dados",
      titulo: "Venda recusada",
      mensagem: motivo || "Revise os dados do comprador e envie novamente.",
      rifas: numerosRifas || [],
      lida: false,
      data_criacao: new Date().toISOString(),
    });
  }

  static criarNotificacaoRifaLiberada(
    batch: admin.firestore.WriteBatch,
    vendedorId: string,
    motivo: string,
    numerosRifas: string[],
  ) {
    const db = admin.firestore();
    const notificacaoRef = db.collection("notificacoes").doc();

    if (!vendedorId) return;

    batch.set(notificacaoRef, {
      vendedor_id: vendedorId,
      tipo: "rifa_liberada",
      titulo: "Rifas disponíveis novamente",
      mensagem:
        motivo || "O pagamento não foi confirmado pelo banco e as rifas voltaram para venda.",
      rifas: numerosRifas || [],
      lida: false,
      data_criacao: new Date().toISOString(),
    });
  }
}
