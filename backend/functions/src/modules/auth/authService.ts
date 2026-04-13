// ============================================================================
// ARQUIVO: backend/functions/src/modules/auth/authService.ts
// ============================================================================
import { db } from "../../shared/config/firebaseAdmin"; // Importamos o auth daqui!

export interface DadosRegisto {
  nome?: string;
  cpf?: string;
  telefone?: string;
}

export const authService = {
  // 1. VERIFICAR ELEGIBILIDADE
  async verificarElegibilidade(email: string): Promise<boolean> {
    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", email.toLowerCase().trim())
      .limit(1)
      .get();

    return !userDocs.empty;
  },

  // 2. COMPLETAR O REGISTO (Vincular Firebase Auth com o Firestore)
  async completarRegisto(
    email: string,
    uid: string,
    dadosFormulario: DadosRegisto,
  ): Promise<void> {
    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", email.toLowerCase().trim())
      .limit(1)
      .get();

    if (userDocs.empty) {
      throw new Error("USUARIO_NAO_ENCONTRADO");
    }

    const docSnap = userDocs.docs[0];
    const docId = docSnap.id;
    const dadosAntigos = docSnap.data();

    await db
      .collection("usuarios")
      .doc(docId)
      .update({
        uid: uid,
        cpf: dadosFormulario.cpf || "",
        nome: dadosFormulario.nome
          ? String(dadosFormulario.nome).toUpperCase()
          : dadosAntigos.nome || "",
        telefone: dadosFormulario.telefone
          ? String(dadosFormulario.telefone)
          : dadosAntigos.telefone || "",
        status: "Ativo",
        data_ativacao: new Date().toISOString(),
      });
  },

  /* 👇 DESATIVADO: Usaremos o sendPasswordResetEmail no Frontend
  async gerarLinkRecuperacao(email: string): Promise<string> {
    try {
      const link = await auth.generatePasswordResetLink(email);
      return link;
    } catch (error: any) {
      console.error("Erro ao gerar link no Firebase Admin:", error);
      throw error;
    }
  },
  */
};
