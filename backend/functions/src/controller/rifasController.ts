import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as admin from "firebase-admin";

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Acesso ao Firebase Storage (HD na nuvem)

export const rifasController = {
  // =========================================================
  // 1. BUSCAR AS RIFAS DO ADERIDO LOGADO
  // =========================================================
  async getMinhasRifas(req: AuthRequest, res: Response) {
    try {
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
      const uid = req.user?.uid;
      // Os dados de texto vêm no req.body. A imagem vem no req.file (injetado pelo Multer)
      const { nome, telefone, email, numerosRifas } = req.body;
      const comprovanteFile = req.file;

      if (!uid || !comprovanteFile || !numerosRifas) {
        return res
          .status(400)
          .json({ error: "Dados incompletos ou comprovante faltando." });
      }

      // O frontend envia arrays em FormData como string, precisamos converter de volta
      const numerosArray: string[] = JSON.parse(numerosRifas);

      // 1. UPLOAD DO COMPROVANTE PARA O STORAGE
      const extensao = comprovanteFile.originalname.split(".").pop();
      const nomeArquivo = `comprovantes/${uid}_${Date.now()}.${extensao}`;
      const fileRef = bucket.file(nomeArquivo);

      await fileRef.save(comprovanteFile.buffer, {
        contentType: comprovanteFile.mimetype,
      });

      // Gera a URL pública da imagem recém-salva
      const comprovanteUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(nomeArquivo)}?alt=media`;

      // 2. REGISTRAR O COMPRADOR NO FIRESTORE
      const compradorRef = db.collection("compradores").doc();
      await compradorRef.set({
        id: compradorRef.id,
        nome,
        telefone,
        email: email || null,
        criado_em: new Date().toISOString(),
      });

      // 3. ATUALIZAR OS BILHETES (TRANSAÇÃO EM LOTE / BATCH)
      // O Batch garante que ou todos os bilhetes são salvos, ou nenhum é. Evita inconsistências.
      const batch = db.batch();

      numerosArray.forEach((numero) => {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        batch.update(bilheteRef, {
          status: "em_analise",
          comprador_id: compradorRef.id,
          data_reserva: new Date().toISOString(),
          comprovante_url: comprovanteUrl,
        });
      });

      await batch.commit();

      // (AQUI ENTRARÁ O CÓDIGO DO ENVIO DE EMAIL COM O NODEMAILER FUTURAMENTE)

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
