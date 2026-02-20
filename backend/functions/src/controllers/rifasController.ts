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

      const uid = req.user?.uid;
      if (!uid)
        return res.status(401).json({ error: "Usuário não autenticado." });

      // 1. Acha o usuário pelo UID para descobrir o CPF dele
      const userDocs = await db
        .collection("usuarios")
        .where("uid", "==", uid)
        .limit(1)
        .get();

      if (userDocs.empty) {
        return res
          .status(404)
          .json({ error: "Cadastro de formando não encontrado." });
      }

      const usuario = userDocs.docs[0].data();
      const cpf = usuario.cpf;

      // 2. Busca apenas os bilhetes que pertencem a este CPF
      const bilhetesSnapshot = await db
        .collection("bilhetes")
        .where("vendedor_cpf", "==", cpf)
        .get();

      const bilhetes = bilhetesSnapshot.docs.map((doc) => doc.data());

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
      const db = admin.firestore();

      const uid = req.user?.uid;
      // Agora recebemos a URL pronta do Frontend e os arrays nativos!
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
        batch.update(bilheteRef, {
          status: "em_analise",
          comprador_id: compradorRef.id,
          data_reserva: new Date().toISOString(),
          comprovante_url: comprovanteUrl, // Salva o link que o frontend mandou
        });
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
