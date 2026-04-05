import * as admin from "firebase-admin";
import axios from "axios";
import { NotificacoesService } from "./notificacoesService";
import { enviarEmailRecibo } from "./emailService";

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
        const { status, mensagem } = respostaOcr.data;

        const isAprovado = status === "APROVADO";
        const logParaSalvar = isAprovado
          ? `✅ Pré-aprovado pela IA: ${mensagem}`
          : `⚠️ Divergência: ${mensagem}`;

        isAprovado
          ? (preAprovados += documentos.length)
          : (divergentes += documentos.length);
        documentos.forEach((doc) =>
          batch.update(doc.ref, { log_automacao: logParaSalvar }),
        );
      } catch (err) {
        documentos.forEach((doc) =>
          batch.update(doc.ref, {
            log_automacao: `❌ Erro de comunicação com a IA OCR.`,
          }),
        );
        divergentes += documentos.length;
      }
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

  // Adicione esta função dentro da classe AuditoriaService
  static async listarPendentes() {
    const db = admin.firestore();
    const pendentesSnapshot = await db
      .collection("bilhetes")
      .where("status", "==", "pendente")
      .get();

    return pendentesSnapshot.docs.map((doc) => doc.data());
  }
}
