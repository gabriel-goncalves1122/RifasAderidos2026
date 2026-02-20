import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as admin from "firebase-admin";

export const rifasController = {
  // =========================================================
  // 1. BUSCAR AS RIFAS DO ADERIDO LOGADO
  // =========================================================
  async getMinhasRifas(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();

      const emailLogado = req.user?.email;
      if (!emailLogado) {
        return res
          .status(401)
          .json({ error: "Usuário não autenticado ou sem e-mail." });
      }

      // 1. Busca pelo E-mail que está no nosso CSV
      const userDocs = await db
        .collection("usuarios")
        .where("email", "==", emailLogado)
        .limit(1)
        .get();

      if (userDocs.empty) {
        return res
          .status(404)
          .json({ error: "Você não está na lista de aderidos oficiais." });
      }

      const usuario = userDocs.docs[0].data();
      const idAderido = usuario.id_aderido;

      // 2. Busca os 120 bilhetes atrelados a este usuário
      const bilhetesSnapshot = await db
        .collection("bilhetes")
        .where("vendedor_id", "==", idAderido)
        .get();

      const bilhetes = bilhetesSnapshot.docs.map((doc) => doc.data());

      // Ordena numericamente para a tela não ficar bagunçada
      bilhetes.sort((a, b) => parseInt(a.numero) - parseInt(b.numero));

      return res.json({ bilhetes });
    } catch (error) {
      console.error("Erro ao buscar rifas:", error);
      return res.status(500).json({ error: "Erro interno ao buscar rifas." });
    }
  },

  // =========================================================
  // 2. PROCESSAR A VENDA E SALVAR COMPROVANTE
  // =========================================================
  async processarVenda(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore(); // <-- Variável restaurada!

      const uid = req.user?.uid;
      const { nome, telefone, email, numerosRifas, comprovanteUrl } = req.body;

      if (
        !uid ||
        !comprovanteUrl ||
        !numerosRifas ||
        numerosRifas.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Dados incompletos ou comprovante faltando." });
      }

      // 1. REGISTRAR O COMPRADOR NO FIRESTORE
      const compradorRef = db.collection("compradores").doc();
      await compradorRef.set({
        id: compradorRef.id,
        nome,
        telefone,
        email: email || null,
        criado_em: new Date().toISOString(),
      });

      // 2. ATUALIZAR OS BILHETES (BATCH)
      const batch = db.batch();

      numerosRifas.forEach((numero: string) => {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        // Usando set com merge para garantir que não dê erro se o documento não existir
        batch.set(
          bilheteRef,
          {
            status: "em_analise",
            comprador_id: compradorRef.id,
            data_reserva: new Date().toISOString(),
            comprovante_url: comprovanteUrl,
          },
          { merge: true },
        );
      });

      await batch.commit();

      return res.status(200).json({
        sucesso: true,
        mensagem: "Venda registrada com sucesso! Comprovante em análise.",
      });
    } catch (error) {
      console.error("Erro ao processar venda:", error);
      return res.status(500).json({ error: "Erro ao processar a venda." });
    }
  },
};
