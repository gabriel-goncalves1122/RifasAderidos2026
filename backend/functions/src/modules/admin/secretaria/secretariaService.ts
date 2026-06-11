// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaService.ts
// ============================================================================
import { db } from "../../../shared/config/firebaseAdmin";
import { Bilhete, Usuario } from "../../types/models";

import {
  DadosAtualizacaoAderido,
  DadosNovoAderido,
  ModalidadeAdesao,
} from "./secretariaTypes";

import {
  montarCamposAtualizacaoAderido,
  normalizarDadosNovoAderido,
} from "./secretariaMapper";

const META_VENDAS_POR_MODALIDADE: Record<ModalidadeAdesao, number> = {
  completo: 1200,
  meio: 600,
};

const BILHETES_POR_MODALIDADE: Record<ModalidadeAdesao, number> = {
  completo: 120,
  meio: 60,
};

export const secretariaService = {
  async adicionarAderido(dadosNovos: DadosNovoAderido) {
    const dados = normalizarDadosNovoAderido(dadosNovos);

    const bilhetesPorPessoa = BILHETES_POR_MODALIDADE[dados.modalidade_adesao];
    const metaVendas = META_VENDAS_POR_MODALIDADE[dados.modalidade_adesao];

    const emailSnapshot = await db
      .collection("usuarios")
      .where("email", "==", dados.email)
      .limit(1)
      .get();

    if (!emailSnapshot.empty) {
      throw new Error("Este e-mail já foi autorizado anteriormente.");
    }

    const contadorRef = db.collection("contadores").doc("aderidos");
    const contadorExistente = await contadorRef.get();

    if (!contadorExistente.exists) {
      const usersSnap = await db
        .collection("usuarios")
        .orderBy("posicao_adesao", "desc")
        .limit(1)
        .get();

      const ultimaPosicao =
        !usersSnap.empty && typeof usersSnap.docs[0].data().posicao_adesao === "number"
          ? usersSnap.docs[0].data().posicao_adesao
          : 0;

      const bilhetesSnap = await db
        .collection("bilhetes")
        .orderBy("numero", "desc")
        .limit(1)
        .get();

      const ultimoBilhete =
        !bilhetesSnap.empty && !Number.isNaN(parseInt(bilhetesSnap.docs[0].id, 10))
          ? parseInt(bilhetesSnap.docs[0].id, 10)
          : 0;

      await contadorRef.set({
        ultima_posicao: ultimaPosicao,
        ultimo_bilhete: ultimoBilhete,
      });
    }

    let idAderido = "";
    let numeroInicio = "";
    let numeroFim = "";

    await db.runTransaction(async (transaction) => {
      const contadorSnap = await transaction.get(contadorRef);
      const dadosContador = contadorSnap.data()!;

      const proximaPosicao = (dadosContador.ultima_posicao || 0) + 1;
      const proximoNumeroBilhete = (dadosContador.ultimo_bilhete || 0) + 1;

      idAderido = `ADERIDO_${String(proximaPosicao).padStart(3, "0")}`;
      const userRef = db.collection("usuarios").doc(idAderido);

      numeroInicio = String(proximoNumeroBilhete).padStart(5, "0");
      numeroFim = String(proximoNumeroBilhete + bilhetesPorPessoa - 1).padStart(5, "0");

      const novoUsuario: Usuario & {
        posicao_adesao: number;
        curso?: string;
        data_nascimento?: string;
        modalidade_adesao: ModalidadeAdesao;
        status_cadastro: "pendente";
      } = {
        id: idAderido,
        id_aderido: idAderido,
        posicao_adesao: proximaPosicao,

        uid: null,
        cpf: "",
        email: dados.email,
        nome: dados.nome,
        curso: dados.curso,
        data_nascimento: dados.dataNascimento,
        telefone: dados.telefone,

        cargo: dados.cargo,
        modalidade_adesao: dados.modalidade_adesao,

        faixa_rifas: {
          inicio: numeroInicio,
          fim: numeroFim,
        },

        meta_vendas: metaVendas,
        total_arrecadado: 0,
        rifas_vendidas: 0,

        status: "pendente",
        status_cadastro: "pendente",

        criado_em: new Date().toISOString(),
      };

      transaction.set(userRef, novoUsuario);

      let b = proximoNumeroBilhete;
      const fim = proximoNumeroBilhete + bilhetesPorPessoa;

      for (; b < fim; b++) {
        const numeroString = String(b).padStart(5, "0");
        const bilheteRef = db.collection("bilhetes").doc(numeroString);

        transaction.set(bilheteRef, {
          numero: numeroString,
          status: "disponivel",

          vendedor_cpf: "",
          vendedor_id: idAderido,
          vendedor_nome: dados.nome,

          comprador_id: null,
          data_reserva: null,
          data_pagamento: null,
          comprovante_url: null,
        } as Bilhete);
      }

      transaction.set(contadorRef, {
        ultima_posicao: proximaPosicao,
        ultimo_bilhete: fim - 1,
      });
    });

    return {
      idAderido,
      modalidade: dados.modalidade_adesao,
      bilhetesGerados: bilhetesPorPessoa,
      faixaRifas: {
        inicio: numeroInicio,
        fim: numeroFim,
      },
    };
  },

  async atualizarAderido(idAderido: string, dados: DadosAtualizacaoAderido) {
    const aderidoRef = db.collection("usuarios").doc(idAderido);
    const aderidoSnap = await aderidoRef.get();

    if (!aderidoSnap.exists) {
      throw new Error("Aderido não encontrado.");
    }

    const aderidoAtual = aderidoSnap.data();

    if (
      aderidoAtual?.status_cadastro === "ativo" &&
      dados.status_cadastro === "pendente"
    ) {
      throw new Error(
        "Não é permitido alterar um aderido ativo para pendente.",
      );
    }

    const camposAtualizacao = montarCamposAtualizacaoAderido(dados);

    await aderidoRef.update(camposAtualizacao);

    return {
      idAderido,
      camposAtualizados: Object.keys(camposAtualizacao),
    };
  },
};
