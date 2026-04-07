// ============================================================================
// ARQUIVO: backend/functions/src/controllers/authController.ts
// ============================================================================
import { Request, Response } from "express";
import * as admin from "firebase-admin";

// Estendemos o Request para o TypeScript saber que o middleware de Autenticação injecta o 'user'
export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authController = {
  // 1. VERIFICA SE O EMAIL ESTÁ NA LISTA DA KEEPER (Antes de criar a senha)
  async verificarElegibilidade(req: Request, res: Response) {
    try {
      const db = admin.firestore();
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "E-mail não fornecido." });
      }

      const userDocs = await db
        .collection("usuarios")
        .where("email", "==", email.toLowerCase())
        .limit(1)
        .get();

      if (userDocs.empty) {
        return res.status(403).json({
          error:
            "E-mail não encontrado na lista oficial da comissão. Utilize o mesmo e-mail da Keeper.",
        });
      }

      return res
        .status(200)
        .json({ sucesso: true, mensagem: "Formando elegível." });
    } catch (error) {
      console.error("Erro ao verificar elegibilidade:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  },

  // 2. COMPLETA O REGISTO (Guarda Nome e CPF após criar a conta no Firebase Auth)
  async completarRegisto(req: AuthRequest, res: Response) {
    try {
      // O 'req.user' é garantido pelo 'validateToken' nas rotas
      if (!req.user || !req.user.email) {
        return res.status(401).json({ error: "Não autorizado." });
      }

      const email = req.user.email.toLowerCase();
      const uid = req.user.uid;

      // Dados que vêm do formulário do Frontend
      const { nome, cpf, telefone } = req.body;

      const db = admin.firestore();

      // Procura o documento original da pessoa
      const userDocs = await db
        .collection("usuarios")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (userDocs.empty) {
        return res
          .status(404)
          .json({ error: "Usuário não encontrado na base de dados." });
      }

      const docId = userDocs.docs[0].id;

      // Atualiza o documento adicionando as informações vitais
      await db
        .collection("usuarios")
        .doc(docId)
        .update({
          auth_uid: uid, // Liga o banco de dados à conta de login
          nome: nome || userDocs.docs[0].data().nome,
          cpf: cpf || null,
          telefone: telefone || null,
          status_cadastro: "completo",
          atualizado_em: admin.firestore.FieldValue.serverTimestamp(),
        });

      return res
        .status(200)
        .json({ sucesso: true, mensagem: "Registo concluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao completar registo:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao finalizar o registo." });
    }
  },
};
