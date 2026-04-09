import * as admin from "firebase-admin";
import { enviarEmailRecibo } from "./emailService";

export class RifasService {
  /**
   * Busca todas as rifas que pertencem a um aderido específico (pelo e-mail).
   */
  static async buscarPorAderido(emailLogado: string) {
    const db = admin.firestore();

    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", emailLogado)
      .limit(1)
      .get();

    if (userDocs.empty) {
      throw new Error("USER_NOT_FOUND");
    }

    const idAderido = userDocs.docs[0].data().id_aderido;

    const bilhetesSnapshot = await db
      .collection("bilhetes")
      .where("vendedor_id", "==", idAderido)
      .get();
    const bilhetes = bilhetesSnapshot.docs.map((doc) => doc.data());

    // Ordena numericamente
    bilhetes.sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
    return bilhetes;
  }

  /**
   * Processa uma nova venda, reserva os bilhetes e dispara o e-mail de "Pendente".
   */
  static async processarVenda(
    uid: string,
    emailLogado: string,
    dadosVenda: any,
  ) {
    const db = admin.firestore();
    const { nome, telefone, email, numerosRifas, comprovanteUrl } = dadosVenda;

    if (!comprovanteUrl || !numerosRifas || numerosRifas.length === 0) {
      throw new Error("INVALID_DATA");
    }

    let vendedorNome = "Nome não registado";
    let vendedorCpf = "CPF não registado";

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

    const batch = db.batch();
    const compradorRef = db.collection("compradores").doc();

    batch.set(compradorRef, {
      id: compradorRef.id,
      nome,
      telefone,
      email: email || null,
      criado_em: new Date().toISOString(),
    });

    numerosRifas.forEach((numero: string) => {
      const bilheteRef = db.collection("bilhetes").doc(numero);
      batch.set(
        bilheteRef,
        {
          status: "pendente",
          comprador_id: compradorRef.id,
          comprador_nome: nome,
          comprador_email: email || null,
          vendedor_nome: vendedorNome,
          vendedor_cpf: vendedorCpf,
          data_reserva: new Date().toISOString(),
          comprovante_url: comprovanteUrl,
        },
        { merge: true },
      );
    });

    await batch.commit();

    if (email) {
      enviarEmailRecibo(email, nome, numerosRifas, "pendente");
    }
  }

  /**
   * Puxa o relatório completo que cruza os utilizadores com os bilhetes pagos.
   */
  static async obterRelatorioTesouraria() {
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

    return {
      resumoGeral: {
        totalArrecadado: totalArrecadadoGlobal,
        rifasPagas: rifasPagasGlobal,
        aderidosAtivos: aderidos.length,
      },
      aderidos,
    };
  }

  /**
   * Busca absolutamente todos os bilhetes que tiveram interação (para CSV/Gráficos)
   */
  static async obterHistoricoDetalhado() {
    const db = admin.firestore();
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
        valor: 10,
      };
    });

    historico.sort((a, b) => {
      const dataA = new Date(a.data_reserva).getTime() || 0;
      const dataB = new Date(b.data_reserva).getTime() || 0;
      return dataB - dataA;
    });

    return historico;
  }
}
