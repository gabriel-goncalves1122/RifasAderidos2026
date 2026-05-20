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

    // Regra de negócio centralizada por modalidade.
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

    let proximaPosicao = 1;

    const usersSnap = await db
      .collection("usuarios")
      .orderBy("posicao_adesao", "desc")
      .limit(1)
      .get();

    if (!usersSnap.empty) {
      const ultimaPosicao = usersSnap.docs[0].data().posicao_adesao;

      if (typeof ultimaPosicao === "number") {
        proximaPosicao = ultimaPosicao + 1;
      }
    }

    let proximoNumeroBilhete = 1;

    const bilhetesSnap = await db
      .collection("bilhetes")
      .orderBy("numero", "desc")
      .limit(1)
      .get();

    if (!bilhetesSnap.empty) {
      const ultimoBilhete = parseInt(bilhetesSnap.docs[0].id, 10);

      if (!Number.isNaN(ultimoBilhete)) {
        proximoNumeroBilhete = ultimoBilhete + 1;
      }
    }

    const batch = db.batch();

    const idAderido = `ADERIDO_${String(proximaPosicao).padStart(3, "0")}`;
    const userRef = db.collection("usuarios").doc(idAderido);

    const numeroInicio = String(proximoNumeroBilhete).padStart(5, "0");
    const numeroFim = String(
      proximoNumeroBilhete + bilhetesPorPessoa - 1,
    ).padStart(5, "0");

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

    batch.set(userRef, novoUsuario);

    for (let b = 0; b < bilhetesPorPessoa; b++) {
      const numeroString = String(proximoNumeroBilhete).padStart(5, "0");
      const bilheteRef = db.collection("bilhetes").doc(numeroString);

      const novoBilhete: Bilhete = {
        numero: numeroString,
        status: "disponivel",

        vendedor_cpf: "",
        vendedor_id: idAderido,
        vendedor_nome: dados.nome,

        comprador_id: null,
        data_reserva: null,
        data_pagamento: null,
        comprovante_url: null,
      };

      batch.set(bilheteRef, novoBilhete);
      proximoNumeroBilhete++;
    }

    await batch.commit();

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
