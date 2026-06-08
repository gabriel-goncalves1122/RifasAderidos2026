import * as admin from "firebase-admin";

import { Bilhete } from "../../types/models";
import { enviarEmailRecibo } from "../../rifas/emailService";
import { ResultadoReenvioEmailComprovante } from "../types/tesourariaTypes";

function normalizarTexto(valor?: string | null) {
  return String(valor || "").trim();
}

function obterNumeroRifa(doc: admin.firestore.QueryDocumentSnapshot) {
  const dados = doc.data() as Partial<Bilhete>;

  return normalizarTexto(dados.numero) || doc.id;
}

export class EmailComprovanteService {
  static async reenviarEmailComprovante(
    compradorId: string,
  ): Promise<ResultadoReenvioEmailComprovante> {
    const db = admin.firestore();
    const bilhetesSnap = await db
      .collection("bilhetes")
      .where("comprador_id", "==", compradorId)
      .get();

    if (bilhetesSnap.empty) {
      throw new Error("COMPRA_NAO_ENCONTRADA");
    }

    const bilhetes = bilhetesSnap.docs.map((doc) => ({
      numero: obterNumeroRifa(doc),
      dados: doc.data() as Bilhete,
    }));

    const todosPagos = bilhetes.every(
      ({ dados }) => normalizarTexto(dados.status) === "pago",
    );

    if (!todosPagos) {
      throw new Error("COMPRA_NAO_PAGA");
    }

    const email = normalizarTexto(
      bilhetes.find(({ dados }) => normalizarTexto(dados.comprador_email))
        ?.dados.comprador_email,
    );

    if (!email) {
      throw new Error("COMPRA_SEM_EMAIL");
    }

    const nome =
      normalizarTexto(
        bilhetes.find(({ dados }) => normalizarTexto(dados.comprador_nome))
          ?.dados.comprador_nome,
      ) || "Comprador";
    const rifas = bilhetes
      .map(({ numero }) => numero)
      .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

    const enviado = await enviarEmailRecibo(email, nome, rifas, "aprovado");

    if (!enviado) {
      throw new Error("EMAIL_COMPROVANTE_NAO_ENVIADO");
    }

    return {
      comprador_id: compradorId,
      email,
      rifas,
      status: "aprovado",
    };
  }
}
