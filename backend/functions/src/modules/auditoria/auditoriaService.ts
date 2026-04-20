// ============================================================================
// ARQUIVO: backend/functions/src/modules/auditoria/auditoriaService.ts
// ============================================================================
import * as admin from "firebase-admin";
import { NotificacoesService } from "../notificacoes/notificacoesService";
import { enviarEmailRecibo } from "../rifas/emailService";
import { OcrService } from "./ocrLogic/OcrService";
import { Bilhete } from "../types/models"; // <-- IMPORTAÇÃO DA TIPAGEM

export class AuditoriaService {
  static extrairCaminhoStorage(url: string): string | null {
    try {
      return decodeURIComponent(url.split("/o/")[1].split("?")[0]);
    } catch (e) {
      return null;
    }
  }

  static async auditarLoteIA(): Promise<{
    preAprovados: number;
    divergentes: number;
    jaAvaliados: number;
    total: number;
  }> {
    const db = admin.firestore();
    const pendentesSnap = await db
      .collection("bilhetes")
      .where("status", "==", "pendente")
      .where("comprovante_url", "!=", null)
      .get();

    if (pendentesSnap.empty)
      return { preAprovados: 0, divergentes: 0, jaAvaliados: 0, total: 0 };

    // Tipagem rígida para o Map guardando as referências do Firestore
    const comprovantesMap = new Map<
      string,
      admin.firestore.QueryDocumentSnapshot[]
    >();
    let jaAvaliados = 0;

    for (const doc of pendentesSnap.docs) {
      const dados = doc.data() as Bilhete; // <-- CASTING PARA A INTERFACE BILHETE

      if (dados.log_automacao) {
        jaAvaliados++;
        continue;
      }

      const url = dados.comprovante_url;
      if (url) {
        if (!comprovantesMap.has(url)) comprovantesMap.set(url, []);
        comprovantesMap.get(url)!.push(doc);
      }
    }

    if (comprovantesMap.size === 0)
      return {
        preAprovados: 0,
        divergentes: 0,
        jaAvaliados,
        total: pendentesSnap.size,
      };

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

    const transacoes = Array.from(comprovantesMap.entries());
    const LIMITE_CONCORRENCIA = 3;

    for (let i = 0; i < transacoes.length; i += LIMITE_CONCORRENCIA) {
      const loteAtual = transacoes.slice(i, i + LIMITE_CONCORRENCIA);

      await Promise.all(
        loteAtual.map(async ([urlImagem, documentos]) => {
          try {
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

            documentos.forEach((doc) => {
              // Utilizamos Partial<Bilhete> implícito no update do Firebase
              batch.update(doc.ref, { log_automacao: logParaSalvar });
            });
          } catch (err) {
            documentos.forEach((doc) => {
              batch.update(doc.ref, {
                log_automacao: `❌ Erro de comunicação com o motor OCR local.`,
              });
            });
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
  ): Promise<void> {
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

      const dados = snap.data() as Bilhete; // <-- CASTING RÍGIDO AQUI

      if (dados?.status !== "pendente") continue;

      compradorEmail = compradorEmail || dados?.comprador_email || null;
      compradorNome = compradorNome || dados?.comprador_nome || null;
      vendedorId = vendedorId || dados?.vendedor_id || null;
      urlStorage = urlStorage || dados?.comprovante_url || null;

      if (decisao === "aprovar") {
        batch.update(docRef, {
          status: "pago",
          data_pagamento: new Date().toISOString(),
          motivo_recusa: null,
          log_automacao: null,
        });
      } else {
        batch.update(docRef, {
          status: "recusado",
          motivo_recusa: motivo,
          log_automacao: null,
          comprovante_url: null,
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

  static async listarPendentes(): Promise<Bilhete[]> {
    // <-- RETORNO TIPADO
    const db = admin.firestore();
    const pendentesSnapshot = await db
      .collection("bilhetes")
      .where("status", "==", "pendente")
      .get();

    return pendentesSnapshot.docs.map((doc) => doc.data() as Bilhete); // <-- MAPEAMENTO TIPADO
  }

  static async salvarExtratoCsv(extratoTexto: string): Promise<void> {
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
