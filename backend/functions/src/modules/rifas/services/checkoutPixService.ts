// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/checkoutPixService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { Bilhete, Comprador, PagamentoPix } from "../../types/models";
import {
  calcularValorPixCentavos,
  calcularValorPixReais,
  dataExpiracaoPix,
  montarReferenceIdPix,
  montarRespostaCheckoutPix,
  normalizarDadosCheckoutPix,
  normalizarQrCodePagBank,
} from "../helpers/checkoutPixHelper";
import {
  CheckoutPixResposta,
  CriarCheckoutPixPayload,
} from "../types/rifasTypes";
import { obterContextoAderidoPorEmail } from "../helpers/usuarioRifasHelper";
import { PagBankPixClient } from "../../../shared/services/pagBankPixClient";

async function verificarDisponibilidadeRifas(
  db: admin.firestore.Firestore,
  numeros: string[],
): Promise<void> {
  for (const numero of numeros) {
    const ref = db.collection("bilhetes").doc(numero);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new Error("RIFA_NOT_FOUND");
    }

    const dados = snap.data() as Bilhete;

    if (dados.status !== "disponivel") {
      throw new Error("RIFA_INDISPONIVEL");
    }
  }
}

export class CheckoutPixService {
  static async criarCobrancaPix(
    uid: string,
    emailLogado: string,
    payload: CriarCheckoutPixPayload,
  ): Promise<CheckoutPixResposta> {
    if (!uid || !emailLogado) {
      throw new Error("UNAUTHORIZED");
    }

    const db = admin.firestore();
    const dados = normalizarDadosCheckoutPix(payload);
    const contextoAderido = await obterContextoAderidoPorEmail(emailLogado);
    const compradorRef = db.collection("compradores").doc();
    const referenceId = montarReferenceIdPix(compradorRef.id);
    const expiraEm = dataExpiracaoPix();

    // Pre-check rápido (fora da transação) para evitar chamada PagBank
    // se alguma rifa já estiver indisponível. A validação definitiva
    // acontece dentro da transação logo abaixo.
    await verificarDisponibilidadeRifas(db, dados.numerosRifas);

    const respostaPagBank = await PagBankPixClient.criarPedidoPix({
      referenceId,
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email,
      documento: dados.documento,
      numerosRifas: dados.numerosRifas,
      valorCentavos: calcularValorPixCentavos(dados.numerosRifas),
      expirationDate: expiraEm,
    });
    const qrCode = normalizarQrCodePagBank(respostaPagBank);
    const orderId = String(respostaPagBank?.id || "").trim();

    if (!orderId) {
      throw new Error("PAGBANK_ORDER_INVALIDO");
    }

    const agora = new Date().toISOString();
    const valorBruto = calcularValorPixReais(dados.numerosRifas);
    const comprador: Comprador = {
      id: compradorRef.id,
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email || null,
      criado_em: agora,
    };
    const pagamentoRef = db.collection("pagamentos_pix").doc(orderId);
    const pagamento: PagamentoPix = {
      id: orderId,
      reference_id: referenceId,
      comprador_id: compradorRef.id,
      vendedor_id: contextoAderido.idAderido,
      vendedor_nome: contextoAderido.vendedorNome,
      comprador_nome: dados.nome,
      comprador_email: dados.email || null,
      comprador_telefone: dados.telefone,
      comprador_documento: dados.documento || null,
      numeros_rifas: dados.numerosRifas,
      valor_bruto: valorBruto,
      valor_pago: 0,
      status_pagamento_banco: "WAITING",
      status_validacao: null,
      pix_order_id: orderId,
      pix_qr_code_id: qrCode.id,
      copia_e_cola: qrCode.copiaECola,
      qr_code_imagem_url: qrCode.qrCodeImagemUrl || null,
      qr_code_base64: qrCode.qrCodeBase64 || null,
      data_criacao: agora,
      data_expiracao: qrCode.expiraEm || null,
      raw_pagbank: respostaPagBank,
    };
    await db.runTransaction(async (transaction) => {
      const rifasRefs = dados.numerosRifas.map((numero) => ({
        numero,
        ref: db.collection("bilhetes").doc(numero),
      }));

      const rifasValidas: typeof rifasRefs = [];

      for (const { numero, ref } of rifasRefs) {
        const snap = await transaction.get(ref);

        if (!snap.exists) {
          throw new Error("RIFA_NOT_FOUND");
        }

        const dadosAtuais = snap.data() as Bilhete;

        if (dadosAtuais.status !== "disponivel") {
          throw new Error("RIFA_INDISPONIVEL");
        }

        rifasValidas.push({ numero, ref });
      }

      transaction.set(compradorRef, comprador);
      transaction.set(pagamentoRef, pagamento);

      rifasValidas.forEach(({ numero, ref }) => {
        transaction.set(
          ref,
          {
            numero,
            status: "reservado",
            comprador_id: compradorRef.id,
            comprador_nome: dados.nome,
            vendedor_nome: contextoAderido.vendedorNome,
            vendedor_cpf: contextoAderido.vendedorCpf,
            vendedor_id: contextoAderido.idAderido,
            data_reserva: agora,
            data_expiracao: qrCode.expiraEm || null,
            pix_order_id: orderId,
            pix_qr_code_id: qrCode.id,
            pix_reference_id: referenceId,
            status_pagamento_banco: "WAITING",
            status_validacao: null,
            valor_bruto: valorBruto / dados.numerosRifas.length,
            valor_pago: 0,
          },
          { merge: true },
        );
      });
    });

    return montarRespostaCheckoutPix({
      id: orderId,
      status: "WAITING",
      qrCode,
    });
  }

  static async consultarCobrancaPix(
    emailLogado: string,
    pagamentoId: string,
  ): Promise<CheckoutPixResposta> {
    const db = admin.firestore();
    const contextoAderido = await obterContextoAderidoPorEmail(emailLogado);
    const snap = await db.collection("pagamentos_pix").doc(pagamentoId).get();

    if (!snap.exists) {
      throw new Error("PAGAMENTO_NOT_FOUND");
    }

    const pagamento = snap.data() as PagamentoPix;

    if (pagamento.vendedor_id !== contextoAderido.idAderido) {
      throw new Error("PAGAMENTO_NOT_FOUND");
    }

    return {
      id: pagamento.id,
      status:
        pagamento.status_pagamento_banco === "PAID" ||
        pagamento.status_pagamento_banco === "AUTHORIZED"
          ? "pago"
          : pagamento.status_pagamento_banco === "DECLINED" ||
              pagamento.status_pagamento_banco === "CANCELED"
            ? "cancelado"
            : "aguardando_pagamento",
      qrCodeImagemUrl: pagamento.qr_code_imagem_url || null,
      qrCodeBase64: pagamento.qr_code_base64 || null,
      copiaECola: pagamento.copia_e_cola || "",
      expiraEm: pagamento.data_expiracao || null,
    };
  }
}
