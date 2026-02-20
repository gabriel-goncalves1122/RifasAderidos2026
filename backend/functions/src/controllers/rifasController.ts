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
  // 2. PROCESSAR A VENDA E SALVAR COMPROVANTE (Enriquecido)
  // =========================================================
  async processarVenda(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();

      const uid = req.user?.uid;
      const emailLogado = req.user?.email; // Precisamos do e-mail para achar o vendedor
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

      // 1. BUSCAR DADOS DO VENDEDOR (Para salvar no bilhete e facilitar a auditoria)
      let vendedorNome = "Nome não registrado";
      let vendedorCpf = "CPF não registrado";

      if (emailLogado) {
        const userDocs = await db
          .collection("usuarios")
          .where("email", "==", emailLogado)
          .limit(1)
          .get();

        if (!userDocs.empty) {
          const userData = userDocs.docs[0].data();
          vendedorNome = userData.nome || vendedorNome;
          vendedorCpf = userData.cpf || vendedorCpf;
        }
      }

      // 2. REGISTRAR O COMPRADOR NO FIRESTORE
      const compradorRef = db.collection("compradores").doc();
      await compradorRef.set({
        id: compradorRef.id,
        nome,
        telefone,
        email: email || null,
        criado_em: new Date().toISOString(),
      });

      // 3. ATUALIZAR OS BILHETES (BATCH COM METADADOS ENRIQUECIDOS)
      const batch = db.batch();

      numerosRifas.forEach((numero: string) => {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        batch.set(
          bilheteRef,
          {
            status: "pendente",
            comprador_id: compradorRef.id,
            comprador_nome: nome, // <--- NOVO METADADO!
            vendedor_nome: vendedorNome, // <--- NOVO METADADO!
            vendedor_cpf: vendedorCpf, // <--- NOVO METADADO!
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

  // ==========================================================================
  // [ADMIN] LISTAR RIFAS PENDENTES DE AUDITORIA
  // ==========================================================================
  async listarPendentes(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();

      // Busca todos os bilhetes que estão aguardando avaliação da Tesouraria
      const pendentesSnapshot = await db
        .collection("bilhetes")
        .where("status", "==", "pendente")
        .get();

      const bilhetesPendentes = pendentesSnapshot.docs.map((doc) => doc.data());

      return res.status(200).json({ bilhetes: bilhetesPendentes });
    } catch (error) {
      console.error("Erro ao listar rifas pendentes:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar rifas pendentes." });
    }
  },

  // ==========================================================================
  // [ADMIN] AVALIAR COMPROVANTE (Aprovar ou Rejeitar)
  // ==========================================================================
  async avaliarComprovante(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();
      // O frontend vai enviar o número do bilhete e a decisão ("aprovar" ou "rejeitar")
      const { numeroRifa, decisao } = req.body;

      if (!numeroRifa || !decisao) {
        return res
          .status(400)
          .json({ error: "Número da rifa e decisão são obrigatórios." });
      }

      const bilheteRef = db.collection("bilhetes").doc(numeroRifa);
      const bilheteSnap = await bilheteRef.get();

      if (!bilheteSnap.exists) {
        return res.status(404).json({ error: "Bilhete não encontrado." });
      }

      const dadosAtuais = bilheteSnap.data();

      // Proteção de concorrência: e se outro tesoureiro já aprovou isso há 5 segundos?
      if (dadosAtuais?.status !== "pendente") {
        return res
          .status(400)
          .json({ error: "Este bilhete não está mais pendente de avaliação." });
      }

      const batch = db.batch();

      if (decisao === "aprovar") {
        batch.update(bilheteRef, {
          status: "pago",
          data_pagamento: new Date().toISOString(),
        });
      } else if (decisao === "rejeitar") {
        // Se for fraude ou erro, resetamos a rifa para o aderido poder vender de novo
        batch.update(bilheteRef, {
          status: "disponivel",
          comprador_id: null,
          data_reserva: null,
          comprovante_url: null,
        });
        // TODO Futuro: Notificar o aderido que o comprovante dele foi rejeitado
      } else {
        return res
          .status(400)
          .json({ error: "Decisão inválida. Use 'aprovar' ou 'rejeitar'." });
      }

      await batch.commit();

      return res.status(200).json({
        sucesso: true,
        mensagem: `Rifa ${numeroRifa} ${decisao === "aprovar" ? "aprovada" : "rejeitada"} com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao avaliar comprovante:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao avaliar comprovante." });
    }
  },
};
