import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as admin from "firebase-admin";
import { enviarEmailRecibo } from "../services/emailService";
import axios from "axios";
import { RifasService } from "../services/rifasService"; // NOVO IMPORT

// Função Auxiliar mantida
function extrairCaminhoStorage(url: string): string | null {
  try {
    const partes = url.split("/o/");
    if (partes.length > 1) {
      return decodeURIComponent(partes[1].split("?")[0]);
    }
    return null;
  } catch (e) {
    return null;
  }
}

export const rifasController = {
  // =========================================================
  // 1. RIFAS / VENDAS / RELATÓRIOS (REFATORADOS PARA SERVICE)
  // =========================================================

  async getMinhasRifas(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.email)
        return res.status(401).json({ error: "Usuário não autenticado." });

      const bilhetes = await RifasService.buscarPorAderido(req.user.email);
      return res.status(200).json({ bilhetes });
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND") {
        return res
          .status(404)
          .json({ error: "Você não está na lista de aderidos oficiais." });
      }
      console.error("Erro ao buscar rifas:", error);
      return res.status(500).json({ error: "Erro interno ao buscar rifas." });
    }
  },

  async processarVenda(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.uid || !req.user?.email)
        return res.status(401).json({ error: "Não autorizado." });

      // Enviando os 3 parâmetros: UID, Email e o Corpo (Body)
      await RifasService.processarVenda(req.user.uid, req.user.email, req.body);

      return res
        .status(200)
        .json({
          sucesso: true,
          mensagem: "Venda registrada com sucesso! Comprovante em análise.",
        });
    } catch (error: any) {
      if (error.message === "INVALID_DATA") {
        return res
          .status(400)
          .json({ error: "Dados incompletos ou comprovante faltando." });
      }
      console.error("Erro ao processar venda:", error);
      return res.status(500).json({ error: "Erro ao processar a venda." });
    }
  },

  async obterRelatorioTesouraria(req: AuthRequest, res: Response) {
    try {
      const relatorio = await RifasService.obterRelatorioTesouraria();
      return res.status(200).json(relatorio);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      return res.status(500).json({ error: "Erro ao gerar relatório." });
    }
  },

  async obterHistoricoDetalhado(req: AuthRequest, res: Response) {
    try {
      const historico = await RifasService.obterHistoricoDetalhado();
      return res.status(200).json({ historico });
    } catch (error) {
      console.error("Erro ao gerar histórico detalhado:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar o histórico de vendas." });
    }
  },

  // ==========================================================================
  // [ADMIN] LISTAR RIFAS PENDENTES DE AUDITORIA (MANTIDO)
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
  // [ADMIN] AVALIAR COMPROVANTE EM LOTE (MANTIDO)
  // ==========================================================================
  async avaliarComprovante(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();
      const { numerosRifas, decisao, motivo } = req.body;

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

      let compradorEmail: string | null = null;
      let compradorNome: string | null = null;
      let vendedorIdParaNotificacao: string | null = null;
      let urlParaApagarDoStorage: string | null = null;

      for (const numero of numerosRifas) {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        const bilheteSnap = await bilheteRef.get();

        if (!bilheteSnap.exists) continue;

        const dadosAtuais = bilheteSnap.data();
        if (dadosAtuais?.status !== "pendente") continue;

        if (!compradorEmail && dadosAtuais?.comprador_email) {
          compradorEmail = dadosAtuais.comprador_email;
          compradorNome = dadosAtuais.comprador_nome || "Comprador";
        }

        if (!vendedorIdParaNotificacao && dadosAtuais?.vendedor_id) {
          vendedorIdParaNotificacao = dadosAtuais.vendedor_id;
        }

        if (!urlParaApagarDoStorage && dadosAtuais?.comprovante_url) {
          urlParaApagarDoStorage = dadosAtuais.comprovante_url;
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
            motivo_recusa:
              motivo || "Comprovante não validado pela tesouraria.",
            log_automacao: null,
          });
        }
      }

      if (decisao === "rejeitar" && vendedorIdParaNotificacao) {
        const notificacaoRef = db.collection("notificacoes").doc();
        batch.set(notificacaoRef, {
          vendedor_id: vendedorIdParaNotificacao,
          titulo: "Comprovante Recusado ⚠️",
          mensagem:
            motivo || "O comprovante enviado não foi aceite pela tesouraria.",
          rifas: numerosRifas,
          lida: false,
          data_criacao: new Date().toISOString(),
        });
      }

      await batch.commit();

      if (decisao === "rejeitar" && urlParaApagarDoStorage) {
        const caminhoDoFicheiro = extrairCaminhoStorage(urlParaApagarDoStorage);
        if (caminhoDoFicheiro) {
          admin
            .storage()
            .bucket()
            .file(caminhoDoFicheiro)
            .delete()
            .catch((err) =>
              console.error(
                "Aviso: Falha ao apagar o ficheiro do storage",
                err,
              ),
            );
        }
      }

      if (decisao === "aprovar" && compradorEmail) {
        enviarEmailRecibo(
          compradorEmail,
          compradorNome || "Comprador",
          numerosRifas,
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
        .json({ error: "Erro interno ao avaliar comprovante." });
    }
  },

  // =========================================================
  // 6. GESTÃO DE PRÊMIOS E SORTEIO (TESOURARIA) (MANTIDO)
  // =========================================================

  async obterPremios(req: any, res: any) {
    try {
      const db = admin.firestore();

      const infoSorteioSnap = await db
        .collection("configuracoes")
        .doc("sorteio")
        .get();
      const infoSorteio = infoSorteioSnap.exists
        ? infoSorteioSnap.data()
        : {
            titulo: "Grande Sorteio da Comissão",
            data: "Data a definir",
            descricao: "Participe e concorra a prêmios incríveis!",
          };

      const premiosSnap = await db
        .collection("premios")
        .orderBy("colocacao")
        .get();
      const premios = premiosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ infoSorteio, premios });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar prêmios." });
    }
  },

  async salvarInfoSorteio(req: any, res: any) {
    try {
      const db = admin.firestore();
      await db.collection("configuracoes").doc("sorteio").set(req.body);
      return res.status(200).json({ sucesso: true });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao salvar informações do sorteio." });
    }
  },

  async salvarPremio(req: any, res: any) {
    try {
      const db = admin.firestore();
      const { id, ...dadosPremio } = req.body;

      if (id) {
        await db.collection("premios").doc(id).update(dadosPremio);
      } else {
        await db.collection("premios").add(dadosPremio);
      }
      return res.status(200).json({ sucesso: true });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao salvar prêmio." });
    }
  },

  async excluirPremio(req: any, res: any) {
    try {
      const db = admin.firestore();
      await db
        .collection("premios")
        .doc(req.params.id as string)
        .delete();
      return res.status(200).json({ sucesso: true });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir prêmio." });
    }
  },

  // ==========================================================================
  // [ADMIN] TRIAGEM INTELIGENTE (MANTIDO)
  // ==========================================================================
  async auditarPendentesEmLote(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();

      const pendentesSnap = await db
        .collection("bilhetes")
        .where("status", "==", "pendente")
        .where("comprovante_url", "!=", null)
        .get();

      if (pendentesSnap.empty) {
        return res
          .status(200)
          .json({ sucesso: true, mensagem: "Nenhum comprovante pendente." });
      }

      const comprovantesMap = new Map<string, any[]>();
      let jaAvaliados = 0;

      for (const doc of pendentesSnap.docs) {
        const dados = doc.data();

        if (dados.log_automacao) {
          jaAvaliados++;
          continue;
        }

        const url = dados.comprovante_url;
        if (!comprovantesMap.has(url)) {
          comprovantesMap.set(url, []);
        }
        comprovantesMap.get(url)!.push(doc);
      }

      const totalImagensUnicas = comprovantesMap.size;
      if (totalImagensUnicas === 0) {
        return res.status(200).json({
          sucesso: true,
          mensagem: `Todos os ${jaAvaliados} bilhetes já estavam auditados pela IA.`,
        });
      }

      let preAprovados = 0;
      let divergentes = 0;
      const batch = db.batch();

      const OCR_API_URL =
        process.env.OCR_API_URL || "http://127.0.0.1:5000/api/validar-pix";

      for (const [urlImagem, documentos] of comprovantesMap.entries()) {
        try {
          const respostaOcr = await axios.post(OCR_API_URL, {
            comprovanteUrl: urlImagem,
          });

          const status = respostaOcr.data.status;
          const mensagemIA = respostaOcr.data.mensagem;

          let logParaSalvar = "";
          if (status === "APROVADO") {
            logParaSalvar = `✅ Pré-aprovado pela IA: ${mensagemIA}`;
            preAprovados += documentos.length;
          } else {
            logParaSalvar = `⚠️ Divergência: ${mensagemIA}`;
            divergentes += documentos.length;
          }

          for (const doc of documentos) {
            batch.update(doc.ref, { log_automacao: logParaSalvar });
          }
        } catch (err) {
          console.error(`Erro de IA no URL: ${urlImagem.substring(0, 30)}...`);
          for (const doc of documentos) {
            batch.update(doc.ref, {
              log_automacao: `❌ Erro de comunicação com a IA OCR.`,
            });
            divergentes++;
          }
        }
      }

      await batch.commit();

      return res.status(200).json({
        sucesso: true,
        mensagem: `Triagem inteligente finalizada! ${preAprovados} bilhetes aprovados, ${divergentes} com divergência.`,
      });
    } catch (error) {
      console.error("Erro na triagem em lote:", error);
      return res.status(500).json({ error: "Erro interno durante a triagem." });
    }
  },

  // =========================================================
  // 7. BUSCAR NOTIFICAÇÕES DO ADERIDO (MANTIDO)
  // =========================================================
  async obterNotificacoes(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();
      const emailLogado = req.user?.email;

      if (!emailLogado)
        return res.status(401).json({ error: "Não autorizado." });

      const userDocs = await db
        .collection("usuarios")
        .where("email", "==", emailLogado)
        .limit(1)
        .get();

      if (userDocs.empty) {
        return res.status(200).json({ notificacoes: [] });
      }

      const idAderido = userDocs.docs[0].data().id_aderido;

      const notificacoesSnap = await db
        .collection("notificacoes")
        .where("vendedor_id", "==", idAderido)
        .orderBy("data_criacao", "desc")
        .limit(20)
        .get();

      const notificacoes = notificacoesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ notificacoes });
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar notificações." });
    }
  },

  // =========================================================
  // 8. MARCAR NOTIFICAÇÕES COMO LIDAS (MANTIDO)
  // =========================================================
  async marcarNotificacoesLidas(req: AuthRequest, res: Response) {
    try {
      const db = admin.firestore();
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids))
        return res.status(400).json({ error: "IDs inválidos." });

      const batch = db.batch();
      ids.forEach((id: string) => {
        const notifRef = db.collection("notificacoes").doc(id);
        batch.update(notifRef, { lida: true });
      });

      await batch.commit();

      return res.status(200).json({ sucesso: true });
    } catch (error) {
      console.error("Erro ao marcar notificações lidas:", error);
      return res.status(500).json({ error: "Erro interno." });
    }
  },
};
