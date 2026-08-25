// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/services/pixValidacaoService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { enviarEmailRecibo } from "../../rifas/emailService";
import { PixTransacao } from "../../tesouraria/types/tesourariaTypes";
import { PixTransacoesService } from "./pixTransacoesService";

interface ValidarPixParams {
  transacaoId: string;
  uidTesouraria: string;
  emailTesouraria?: string;
  motivo?: string;
}

async function buscarTransacao(transacaoId: string): Promise<PixTransacao> {
  const transacoes = await PixTransacoesService.buscarTransacoes();
  const transacao = transacoes.find((item) => item.id === transacaoId);

  if (!transacao) {
    throw new Error("TRANSACAO_NOT_FOUND");
  }

  return transacao;
}

function obterNumerosRifas(transacao: PixTransacao) {
  return (transacao.rifas || []).map((rifa: any) => rifa.numero).filter(Boolean);
}

export class PixValidacaoService {
  static async aceitarTransacao(params: ValidarPixParams) {
    const db = admin.firestore();
    const transacao = await buscarTransacao(params.transacaoId);
    const numerosRifas = obterNumerosRifas(transacao);

    if (numerosRifas.length === 0) {
      throw new Error("TRANSACAO_SEM_RIFAS");
    }

    if (!transacao.pixOrderId) {
      throw new Error("TRANSACAO_SEM_REFERENCIA");
    }

    const validadoEm = new Date().toISOString();
    const validadoPor = params.emailTesouraria || params.uidTesouraria;

    await db.runTransaction(async (transaction) => {
      const querySnap = await transaction.get(
        db.collection("pagamentos_pix").where("pix_order_id", "==", transacao.pixOrderId!).limit(1)
      );

      if (querySnap.empty) {
        throw new Error("PAGAMENTO_NOT_FOUND");
      }

      const pagRef = querySnap.docs[0].ref;
      const pagamento = querySnap.docs[0].data() as any;

      if (pagamento.status_validacao) {
        throw new Error("PIX_ALREADY_VALIDATED");
      }

      if (!["PAID", "AUTHORIZED", "approved", "authorized"].includes(pagamento.status_pagamento_banco)) {
        throw new Error("PIX_NOT_CONFIRMED");
      }

      const bilhetesRefs = numerosRifas.map((numero: string) =>
        db.collection("bilhetes").doc(numero)
      );
      
      const bilhetesSnaps = await transaction.getAll(...bilhetesRefs);
      
      // Validação opcional: garantir que os bilhetes existam
      const bilhetesInexistentes = bilhetesSnaps.filter(snap => !snap.exists);
      if (bilhetesInexistentes.length > 0) {
        throw new Error("UM_OU_MAIS_BILHETES_NAO_ENCONTRADOS");
      }

      bilhetesSnaps.forEach((snap) => {
        transaction.set(
          snap.ref,
          {
            status: "pago",
            status_validacao: "aceita",
            validado_em: validadoEm,
            validado_por: validadoPor,
            motivo_recusa: null,
            data_pagamento: transacao.dataPagamento || validadoEm,
          },
          { merge: true },
        );
      });

      transaction.set(
        pagRef,
        {
          status_validacao: "aceita",
          validado_em: validadoEm,
          validado_por: validadoPor,
          motivo_negacao: null,
        },
        { merge: true },
      );
    });

    const emailEnviado = transacao.compradorEmail
      ? await enviarEmailRecibo(
          transacao.compradorEmail,
          transacao.compradorNome || "Comprador",
          numerosRifas,
          "aprovado",
        )
      : false;

    return {
      sucesso: true,
      statusValidacao: "aceita" as const,
      transacaoId: params.transacaoId,
      rifas: numerosRifas,
      emailEnviado,
    };
  }

  static async negarTransacao(params: ValidarPixParams) {
    const motivo = String(params.motivo || "").trim();

    if (!motivo) {
      throw new Error("MOTIVO_REQUIRED");
    }

    const db = admin.firestore();
    const transacao = await buscarTransacao(params.transacaoId);
    const numerosRifas = obterNumerosRifas(transacao);

    if (numerosRifas.length === 0) {
      throw new Error("TRANSACAO_SEM_RIFAS");
    }

    if (!transacao.pixOrderId) {
      throw new Error("TRANSACAO_SEM_REFERENCIA");
    }

    const validadoEm = new Date().toISOString();
    const validadoPor = params.emailTesouraria || params.uidTesouraria;

    await db.runTransaction(async (transaction) => {
      const querySnap = await transaction.get(
        db.collection("pagamentos_pix").where("pix_order_id", "==", transacao.pixOrderId!).limit(1)
      );

      if (querySnap.empty) {
        throw new Error("PAGAMENTO_NOT_FOUND");
      }

      const pagRef = querySnap.docs[0].ref;
      const pagamento = querySnap.docs[0].data() as any;

      if (pagamento.status_validacao) {
        throw new Error("PIX_ALREADY_VALIDATED");
      }

      const bilhetesRefs = numerosRifas.map((numero: string) =>
        db.collection("bilhetes").doc(numero)
      );
      
      const bilhetesSnaps = await transaction.getAll(...bilhetesRefs);
      
      const bilhetesInexistentes = bilhetesSnaps.filter(snap => !snap.exists);
      if (bilhetesInexistentes.length > 0) {
        throw new Error("UM_OU_MAIS_BILHETES_NAO_ENCONTRADOS");
      }

      bilhetesSnaps.forEach((snap) => {
        transaction.set(
          snap.ref,
          {
            status: "recusado",
            status_validacao: "negada",
            validado_em: validadoEm,
            validado_por: validadoPor,
            motivo_recusa: motivo,
          },
          { merge: true },
        );
      });

      transaction.set(
        pagRef,
        {
          status_validacao: "negada",
          validado_em: validadoEm,
          validado_por: validadoPor,
          motivo_negacao: motivo,
        },
        { merge: true },
      );

      if (transacao.aderido?.id) {
        const notificacaoRef = db.collection("notificacoes").doc();
        transaction.set(notificacaoRef, {
          vendedor_id: transacao.aderido.id,
          tipo: "correcao_dados",
          titulo: "Venda recusada",
          mensagem: motivo || "Revise os dados do comprador e envie novamente.",
          rifas: numerosRifas,
          lida: false,
          data_criacao: validadoEm,
        });
      }
    });

    return {
      sucesso: true,
      statusValidacao: "negada" as const,
      transacaoId: params.transacaoId,
      rifas: numerosRifas,
      motivo,
    };
  }
}

