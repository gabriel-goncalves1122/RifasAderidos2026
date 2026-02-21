import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as admin from "firebase-admin";
import { enviarEmailRecibo } from "../services/emailService";

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

      // 2. Busca os bilhetes atrelados a este usuário
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
      const emailLogado = req.user?.email;
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

      // 1. BUSCAR DADOS DO VENDEDOR
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

      // 2. PREPARAR A TRANSAÇÃO ATÔMICA (BATCH)
      const batch = db.batch();

      // Cria a referência do comprador
      const compradorRef = db.collection("compradores").doc();
      batch.set(compradorRef, {
        id: compradorRef.id,
        nome,
        telefone,
        email: email || null,
        criado_em: new Date().toISOString(),
      });

      // Atualiza os bilhetes
      numerosRifas.forEach((numero: string) => {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        batch.set(
          bilheteRef,
          {
            status: "pendente",
            comprador_id: compradorRef.id,
            comprador_nome: nome,
            comprador_email: email || null, // Facilitador para o envio do recibo final
            vendedor_nome: vendedorNome,
            vendedor_cpf: vendedorCpf,
            data_reserva: new Date().toISOString(),
            comprovante_url: comprovanteUrl,
          },
          { merge: true },
        );
      });

      // Executa a gravação no banco
      await batch.commit();

      // 3. ENVIAR E-MAIL DE CONFIRMAÇÃO DO PEDIDO (Background)
      if (email) {
        enviarEmailRecibo(email, nome, numerosRifas, "pendente");
      }

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
  // [ADMIN] AVALIAR COMPROVANTE EM LOTE (Aprovar ou Rejeitar)
  // ==========================================================================
  async avaliarComprovante(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();

      // AGORA RECEBEMOS UM ARRAY: numerosRifas
      const { numerosRifas, decisao } = req.body;

      if (
        !numerosRifas ||
        !Array.isArray(numerosRifas) ||
        numerosRifas.length === 0 ||
        !decisao
      ) {
        return res.status(400).json({
          error: "Números das rifas (array) e decisão são obrigatórios.",
        });
      }

      const batch = db.batch();

      // Variáveis para guardar os dados do comprador (pegamos do primeiro bilhete do lote)
      let compradorEmail: string | null = null;
      let compradorNome: string | null = null;

      // Percorre todos os bilhetes da compra para atualizar juntos
      for (const numero of numerosRifas) {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        const bilheteSnap = await bilheteRef.get();

        if (!bilheteSnap.exists) continue;

        const dadosAtuais = bilheteSnap.data();

        // Evita re-avaliar rifas que já foram processadas
        if (dadosAtuais?.status !== "pendente") continue;

        // Se achou um e-mail, salva para mandar o recibo no final
        if (!compradorEmail && dadosAtuais?.comprador_email) {
          compradorEmail = dadosAtuais.comprador_email;
          compradorNome = dadosAtuais.comprador_nome || "Comprador";
        }

        if (decisao === "aprovar") {
          batch.update(bilheteRef, {
            status: "pago",
            data_pagamento: new Date().toISOString(),
          });
        } else if (decisao === "rejeitar") {
          batch.update(bilheteRef, {
            status: "disponivel",
            comprador_id: null,
            data_reserva: null,
            comprador_nome: null,
            comprador_email: null,
            comprovante_url: null,
          });
        }
      }

      // Executa todas as atualizações no banco de dados DE UMA SÓ VEZ
      await batch.commit();

      // MÁGICA FINAL: Dispara APENAS UM e-mail para todo o lote se for aprovado!
      if (decisao === "aprovar" && compradorEmail) {
        enviarEmailRecibo(
          compradorEmail,
          compradorNome || "Comprador",
          numerosRifas, // Envia o array inteiro para o e-mail agrupar os bilhetes
          "aprovado",
        );
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: `Lote de ${numerosRifas.length} rifa(s) avaliado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao avaliar comprovante em lote:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao avaliar comprovante em lote." });
    }
  },

  // =========================================================
  // 4. RELATÓRIO DA TESOURARIA (Dashboard)
  // =========================================================
  async obterRelatorioTesouraria(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();

      const usuariosSnap = await db.collection("usuarios").get();

      const bilhetesSnap = await db
        .collection("bilhetes")
        .where("status", "==", "pago")
        .get();

      const vendasPorCpf: Record<string, number> = {};
      bilhetesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.vendedor_cpf) {
          vendasPorCpf[data.vendedor_cpf] =
            (vendasPorCpf[data.vendedor_cpf] || 0) + 1;
        }
      });

      let totalArrecadadoGlobal = 0;
      let rifasPagasGlobal = 0;

      // Filtro para garantir que apenas os aderidos oficiais apareçam no relatório
      const aderidos = usuariosSnap.docs
        .filter((doc) => doc.id.startsWith("ADERIDO_"))
        .map((doc) => {
          const user = doc.data();
          const rifasVendidas = vendasPorCpf[user.cpf] || 0;
          const arrecadado = rifasVendidas * 10;

          totalArrecadadoGlobal += arrecadado;
          rifasPagasGlobal += rifasVendidas;

          return {
            id: doc.id,
            nome: user.nome || "Aderido Sem Nome",
            cpf: user.cpf,
            arrecadado: arrecadado,
            meta: user.meta_vendas || 1200,
            rifasVendidas: rifasVendidas,
          };
        });

      return res.status(200).json({
        resumoGeral: {
          totalArrecadado: totalArrecadadoGlobal,
          rifasPagas: rifasPagasGlobal,
          aderidosAtivos: aderidos.length,
        },
        aderidos,
      });
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      return res.status(500).json({ error: "Erro ao gerar relatório." });
    }
  },

  // =========================================================
  // 5. HISTÓRICO COMPLETO DETALHADO (Para Gráficos e CSV Geral)
  // =========================================================
  async obterHistoricoDetalhado(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();

      // Busca absolutamente todos os bilhetes que já tiveram alguma interação (pagos ou pendentes)
      const bilhetesSnap = await db
        .collection("bilhetes")
        .where("status", "in", ["pago", "pendente"])
        .get();

      const historico = bilhetesSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          numero_rifa: doc.id,
          vendedor_nome: data.vendedor_nome || "Desconhecido",
          vendedor_cpf: data.vendedor_cpf || "-",
          comprador_nome: data.comprador_nome || "Desconhecido",
          comprador_email: data.comprador_email || "-",
          data_reserva: data.data_reserva || "-",
          data_pagamento: data.data_pagamento || "-",
          status: data.status,
          valor: 10, // Valor fixo da rifa
        };
      });

      // Ordena do mais recente para o mais antigo (usando a data de reserva como base)
      historico.sort((a, b) => {
        const dataA = new Date(a.data_reserva).getTime() || 0;
        const dataB = new Date(b.data_reserva).getTime() || 0;
        return dataB - dataA;
      });

      return res.status(200).json({ historico });
    } catch (error) {
      console.error("Erro ao gerar histórico detalhado:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar o histórico de vendas." });
    }
  },
};
