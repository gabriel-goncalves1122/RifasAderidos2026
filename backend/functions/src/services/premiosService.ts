import * as admin from "firebase-admin";

export class PremiosService {
  static async listarTodos() {
    const db = admin.firestore();

    const infoSorteioSnap = await db
      .collection("configuracoes")
      .doc("sorteio")
      .get();
    const infoSorteio = infoSorteioSnap.exists
      ? infoSorteioSnap.data()
      : { titulo: "Sorteio", data: "A definir", descricao: "Participe!" };

    const premiosSnap = await db
      .collection("premios")
      .orderBy("colocacao")
      .get();
    const premios = premiosSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { infoSorteio, premios };
  }

  static async salvarInfoSorteio(dados: any) {
    await admin
      .firestore()
      .collection("configuracoes")
      .doc("sorteio")
      .set(dados);
  }

  static async salvarPremio(dados: any) {
    const db = admin.firestore();
    const { id, ...dadosPremio } = dados;
    if (id) {
      await db.collection("premios").doc(id).update(dadosPremio);
    } else {
      await db.collection("premios").add(dadosPremio);
    }
  }

  static async excluirPremio(id: string) {
    await admin.firestore().collection("premios").doc(id).delete();
  }
}
