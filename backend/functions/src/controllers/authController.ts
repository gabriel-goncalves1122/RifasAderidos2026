import { Request, Response } from "express";
import * as admin from "firebase-admin";

export const authController = {
  async verificarElegibilidade(req: Request, res: Response) {
    try {
      const db = admin.firestore();
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "E-mail não fornecido." });
      }

      // Procura o e-mail na lista oficial de aderidos
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

      // Se achou, libera o cadastro!
      return res
        .status(200)
        .json({ sucesso: true, mensagem: "Formando elegível." });
    } catch (error) {
      console.error("Erro ao verificar elegibilidade:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
};
