// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/relatorioRifasService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { Bilhete, Usuario } from "../../types/models";

export class RelatorioRifasService {
  static async obterRelatorioTesouraria() {
    const db = admin.firestore();

    const usuariosSnap = await db.collection("usuarios").get();

    const bilhetesSnap = await db
      .collection("bilhetes")
      .where("status", "==", "pago")
      .get();

    const vendasPorCpf: Record<string, number> = {};

    bilhetesSnap.forEach((doc) => {
      const data = doc.data() as Bilhete;

      if (data.vendedor_cpf) {
        vendasPorCpf[data.vendedor_cpf] =
          (vendasPorCpf[data.vendedor_cpf] || 0) + 1;
      }
    });

    let totalArrecadadoGlobal = 0;
    let rifasPagasGlobal = 0;

    const aderidos = usuariosSnap.docs
      .filter((doc) => {
        const data = doc.data();

        return (
          data.role === "aderido" ||
          data.cargo === "aderido" ||
          (!data.role && !data.cargo)
        );
      })
      .map((doc) => {
        const user = doc.data() as Usuario;
        const cpfUsuario = user.cpf || "-";
        const rifasVendidas = user.cpf ? vendasPorCpf[user.cpf] || 0 : 0;
        const arrecadado = rifasVendidas * 10;

        totalArrecadadoGlobal += arrecadado;
        rifasPagasGlobal += rifasVendidas;

        return {
          id: doc.id,
          nome: user.nome || "Aderido Sem Nome",
          cpf: cpfUsuario,
          arrecadado,
          meta: user.meta_vendas || 1200,
          rifasVendidas,
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

  static async obterHistoricoDetalhado() {
    const db = admin.firestore();

    const bilhetesSnap = await db
      .collection("bilhetes")
      .where("status", "in", ["pago", "pendente"])
      .get();

    const historico = bilhetesSnap.docs.map((doc) => {
      const data = doc.data() as Bilhete & Record<string, any>;

      return {
        numero_rifa: doc.id,
        vendedor_nome: data.vendedor_nome || "Desconhecido",
        vendedor_cpf: data.vendedor_cpf || "-",
        comprador_nome: data.comprador_nome || "Desconhecido",
        comprador_telefone: data.comprador_telefone || "-",
        comprador_email: data.comprador_email || "-",
        data_reserva: data.data_reserva || "-",
        data_pagamento: data.data_pagamento || "-",
        status: data.status,
        valor: 10,
      };
    });

    historico.sort((a, b) => {
      const dataA = new Date(a.data_reserva || 0).getTime() || 0;
      const dataB = new Date(b.data_reserva || 0).getTime() || 0;

      return dataB - dataA;
    });

    return historico;
  }
}
