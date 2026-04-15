// ============================================================================
// ARQUIVO: backend/functions/src/modules/auditoria/auditoriaService.ts
// ============================================================================
import * as admin from "firebase-admin";
import { NotificacoesService } from "../notificacoes/notificacoesService";
import { enviarEmailRecibo } from "../rifas/emailService";
import { OcrService } from "./ocrLogic/OcrService"; // IMPORTANTE: Nova importação do serviço local!

// Removemos a importação do axios, pois não vamos mais fazer requisições externas para o OCR

export class AuditoriaService {
  static extrairCaminhoStorage(url: string): string | null {
    try {
      return decodeURIComponent(url.split("/o/")[1].split("?")[0]);
    } catch (e) {
      return null;
    }
  }

  static async auditarLoteIA() {
    const db = admin.firestore();
    const pendentesSnap = await db
      .collection("bilhetes")
      .where("status", "==", "pendente")
      .where("comprovante_url", "!=", null)
      .get();

    if (pendentesSnap.empty)
      return { preAprovados: 0, divergentes: 0, jaAvaliados: 0, total: 0 };

    const comprovantesMap = new Map<string, any[]>();
    let jaAvaliados = 0;

    for (const doc of pendentesSnap.docs) {
      const dados = doc.data();
      if (dados.log_automacao) {
        jaAvaliados++;
        continue;
      }

      const url = dados.comprovante_url;
      if (!comprovantesMap.has(url)) comprovantesMap.set(url, []);
      comprovantesMap.get(url)!.push(doc);
    }

    if (comprovantesMap.size === 0)
      return {
        preAprovados: 0,
        divergentes: 0,
        jaAvaliados,
        total: pendentesSnap.size,
      };

    // Busca o texto do CSV salvo na base de dados
    const configSnap = await db
      .collection("configuracoes")
      .doc("sistema")
      .get();
    const extratoTexto = configSnap.data()?.extrato_csv;

    if (!extratoTexto) {
      console.error("Nenhum extrato foi enviado pelo tesoureiro.");
      throw new Error(
        "O extrato da InfinitePay não foi carregado. Faça o upload no painel primeiro.",
      );
    }

    let preAprovados = 0;
    let divergentes = 0;
    const batch = db.batch();

    // Converte o Map para um array para podermos fatiar (processamento em lotes)
    const transacoes = Array.from(comprovantesMap.entries());

    // Podemos aumentar a concorrência agora que estamos no Node/Firebase
    // O Firebase lidará com as threads nativamente. Vamos processar 3 ou 4 de cada vez.
    const LIMITE_CONCORRENCIA = 3;

    for (let i = 0; i < transacoes.length; i += LIMITE_CONCORRENCIA) {
      const loteAtual = transacoes.slice(i, i + LIMITE_CONCORRENCIA);

      // Dispara as validações locais em simultâneo
      await Promise.all(
        loteAtual.map(async ([urlImagem, documentos]) => {
          try {
            // ADEUS AXIOS, OLA PROCESSAMENTO LOCAL!
            const respostaOcr = await OcrService.processarComprovante(
              urlImagem,
              extratoTexto,
            );

            const { status, mensagem } = respostaOcr;
            const isAprovado = status === "APROVADO";

            const logParaSalvar = isAprovado
              ? `✅ Pré-aprovado pela IA: ${mensagem}`
              : `⚠️ Divergência: ${mensagem}`;

            if (isAprovado) {
              preAprovados += documentos.length;
            } else {
              divergentes += documentos.length;
            }

            documentos.forEach((doc) =>
              batch.update(doc.ref, { log_automacao: logParaSalvar }),
            );
          } catch (err) {
            documentos.forEach((doc) =>
              batch.update(doc.ref, {
                log_automacao: `❌ Erro de comunicação com o motor OCR local.`,
              }),
            );
            divergentes += documentos.length;
          }
        }),
      );
    }

    await batch.commit();

    return {
      preAprovados,
      divergentes,
      jaAvaliados,
      total: pendentesSnap.size,
    };
  }

  static async processarDecisaoManual(
    numerosRifas: string[],
    decisao: "aprovar" | "rejeitar",
    motivo: string,
  ) {
    const db = admin.firestore();
    const batch = db.batch();

    let compradorEmail: string | null = null;
    let compradorNome: string | null = null;
    let vendedorId: string | null = null;
    let urlStorage: string | null = null;

    for (const numero of numerosRifas) {
      const docRef = db.collection("bilhetes").doc(numero);
      const snap = await docRef.get();
      if (!snap.exists) continue;

      const dados = snap.data();
      if (dados?.status !== "pendente") continue;

      compradorEmail = compradorEmail || dados?.comprador_email;
      compradorNome = compradorNome || dados?.comprador_nome;
      vendedorId = vendedorId || dados?.vendedor_id;
      urlStorage = urlStorage || dados?.comprovante_url;

      if (decisao === "aprovar") {
        batch.update(docRef, {
          status: "pago",
          data_pagamento: new Date().toISOString(),
        });
      } else {
        batch.update(docRef, {
          status: "disponivel",
          comprador_id: null,
          data_reserva: null,
          comprador_nome: null,
          comprador_email: null,
          comprovante_url: null,
          motivo_recusa: motivo,
          log_automacao: null,
        });
      }
    }

    if (decisao === "rejeitar" && vendedorId) {
      NotificacoesService.criarNotificacaoRecusa(
        batch,
        vendedorId,
        motivo,
        numerosRifas,
      );
    }

    await batch.commit();

    if (decisao === "rejeitar" && urlStorage) {
      const path = this.extrairCaminhoStorage(urlStorage);
      if (path)
        admin
          .storage()
          .bucket()
          .file(path)
          .delete()
          .catch(() => {});
    }

    if (decisao === "aprovar" && compradorEmail) {
      enviarEmailRecibo(
        compradorEmail,
        compradorNome || "Comprador",
        numerosRifas,
        "aprovado",
      );
    }
  }

  static async listarPendentes() {
    const db = admin.firestore();
    const pendentesSnapshot = await db
      .collection("bilhetes")
      .where("status", "==", "pendente")
      .get();

    return pendentesSnapshot.docs.map((doc) => doc.data());
  }

  static async salvarExtratoCsv(extratoTexto: string) {
    const db = admin.firestore();

    await db.collection("configuracoes").doc("sistema").set(
      {
        extrato_csv: extratoTexto,
        atualizado_em: new Date().toISOString(),
      },
      { merge: true },
    );
  }
}
