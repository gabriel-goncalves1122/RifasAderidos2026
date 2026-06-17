// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaService.ts
// ============================================================================
import { db, auth } from "../../../shared/config/firebaseAdmin";
import { AppError } from "../../../shared/classes/AppError";
import { Bilhete, Usuario } from "../../types/models";

import {
  AderidoSecretaria,
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
  async listarAderidos(): Promise<AderidoSecretaria[]> {
    const querySnapshot = await db.collection("usuarios").get();
    
    // Retornamos os dados brutos injetando o ID.
    // O frontend possui o `normalizarAderidoSecretaria` que lidará com campos legados (Nome vs nome, status vs status_cadastro, etc).
    // O frontend também já se encarrega de realizar a ordenação na tabela.
    const docs = querySnapshot.docs || [];
    return docs.map((doc: any) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as unknown as AderidoSecretaria;
    });
  },

  async adicionarAderido(dadosNovos: DadosNovoAderido) {
    const dados = normalizarDadosNovoAderido(dadosNovos);

    const bilhetesPorPessoa = BILHETES_POR_MODALIDADE[dados.modalidade_adesao];
    const metaVendas = META_VENDAS_POR_MODALIDADE[dados.modalidade_adesao];

    // TOCTOU limit: Firestore doesn't support queries inside runTransaction
    const emailSnapshot = await db
      .collection("usuarios")
      .where("email", "==", dados.email)
      .limit(1)
      .get();

    if (!emailSnapshot.empty) {
      throw new AppError("EMAIL_DUPLICADO", "Este e-mail já foi autorizado anteriormente.", 400);
    }

    const contadorRef = db.collection("contadores").doc("aderidos");
    
    let idAderido = "";
    let numeroInicio = "";
    let numeroFim = "";

    await db.runTransaction(async (transaction) => {
      const contadorExistente = await transaction.get(contadorRef);
      let ultimaPosicao = 0;
      let ultimoBilhete = 0;

      if (!contadorExistente.exists) {
        throw new AppError("CONTADOR_NAO_INICIALIZADO", "O contador de aderidos não foi inicializado. Crie-o manualmente no Firestore primeiro.", 500);
      } else {
        const dadosContador = contadorExistente.data()!;
        ultimaPosicao = dadosContador.ultima_posicao || 0;
        ultimoBilhete = dadosContador.ultimo_bilhete || 0;
      }

      const proximaPosicao = ultimaPosicao + 1;
      const proximoNumeroBilhete = ultimoBilhete + 1;

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
    const camposAtualizacao = montarCamposAtualizacaoAderido(dados);
    let uidAderido: string | null = null;
    let novoCargo: string | undefined = dados.cargo;

    await db.runTransaction(async (transaction) => {
      const aderidoSnap = await transaction.get(aderidoRef);

      if (!aderidoSnap.exists) {
        throw new AppError("NAO_ENCONTRADO", "Aderido não encontrado.", 404);
      }

      const aderidoAtual = aderidoSnap.data();
      uidAderido = aderidoAtual?.uid;

      if (
        aderidoAtual?.status_cadastro === "ativo" &&
        dados.status_cadastro === "pendente"
      ) {
        throw new AppError(
          "TRANSICAO_STATUS_INVALIDA",
          "Não é permitido alterar um aderido ativo para pendente.",
          400
        );
      }

      transaction.update(aderidoRef, camposAtualizacao);
    });

    // Se o cargo foi alterado e o usuário já vinculou Firebase Auth, atualiza custom claims
    if (novoCargo && uidAderido) {
      try {
        await auth.setCustomUserClaims(uidAderido, { cargo: novoCargo });
      } catch (error) {
        console.error("[SecretariaService] Erro ao atualizar custom claims:", error);
      }
    }

    return {
      idAderido,
      camposAtualizados: Object.keys(camposAtualizacao),
    };
  },
};
