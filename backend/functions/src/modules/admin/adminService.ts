// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/adminService.ts
// ============================================================================
import { db } from "../../shared/config/firebaseAdmin";
import { Usuario, Bilhete, CargoComissao } from "../types/models";

// 1. Tipagem Forte para os dados que chegam da requisição
export interface DadosNovoAderido {
  email: string;
  nome?: string;
  curso?: string;
  dataNascimento?: string;
  telefone?: string;
  cargo?: CargoComissao;
}

export const adminService = {
  async adicionarAderido(dadosNovos: DadosNovoAderido) {
    const BILHETES_POR_PESSOA = 120;
    const emailLimpo = dadosNovos.email.toLowerCase().trim();

    // 1. VERIFICAR SE O E-MAIL JÁ ESTÁ AUTORIZADO
    const emailSnapshot = await db
      .collection("usuarios")
      .where("email", "==", emailLimpo)
      .get();

    if (!emailSnapshot.empty) {
      throw new Error("Este e-mail já foi autorizado anteriormente.");
    }

    // 2. DESCOBRIR A ÚLTIMA POSIÇÃO (posicao_adesao)
    let proximaPosicao = 1;
    const usersSnap = await db
      .collection("usuarios")
      .orderBy("posicao_adesao", "desc")
      .limit(1)
      .get();

    if (!usersSnap.empty) {
      const dadosUltimo = usersSnap.docs[0].data();
      const ultimaPosicao = dadosUltimo.posicao_adesao;
      if (typeof ultimaPosicao === "number") proximaPosicao = ultimaPosicao + 1;
    }

    // 3. DESCOBRIR O ÚLTIMO BILHETE GERADO
    let proximoNumeroBilhete = 1;
    const bilhetesSnap = await db
      .collection("bilhetes")
      .orderBy("numero", "desc")
      .limit(1)
      .get();

    if (!bilhetesSnap.empty) {
      const ultimoBilhete = parseInt(bilhetesSnap.docs[0].id, 10);
      if (!isNaN(ultimoBilhete)) proximoNumeroBilhete = ultimoBilhete + 1;
    }

    // ==============================================================
    // INÍCIO DA TRANSAÇÃO (BATCH) NO SERVIDOR
    // ==============================================================
    const batch = db.batch();

    // A. CRIAR O NOVO USUÁRIO FORTEMENTE TIPADO
    const idAderido = `ADERIDO_${String(proximaPosicao).padStart(3, "0")}`;
    const userRef = db.collection("usuarios").doc(idAderido);

    // Definir a faixa de rifas para a interface
    const numeroInicio = String(proximoNumeroBilhete).padStart(5, "0");
    const numeroFim = String(
      proximoNumeroBilhete + BILHETES_POR_PESSOA - 1,
    ).padStart(5, "0");

    // Construímos o objeto garantindo que ele cumpre a Interface 'Usuario'
    const novoUsuario: Usuario & {
      posicao_adesao: number;
      curso?: string;
      data_nascimento?: string;
    } = {
      id: idAderido,
      id_aderido: idAderido,
      posicao_adesao: proximaPosicao, // Campo extra do admin
      uid: null,
      cpf: "", // Será preenchido pelo aderido no primeiro acesso
      email: emailLimpo,
      nome: dadosNovos.nome ? String(dadosNovos.nome).toUpperCase() : "",
      curso: dadosNovos.curso ? String(dadosNovos.curso).toUpperCase() : "",
      data_nascimento: dadosNovos.dataNascimento || "",
      telefone: dadosNovos.telefone || "",
      cargo: dadosNovos.cargo || "aderido",
      faixa_rifas: {
        inicio: numeroInicio,
        fim: numeroFim,
      },
      meta_vendas: 1200,
      total_arrecadado: 0,
      rifas_vendidas: 0,
      status: "pendente", // Ajustado para obedecer à interface (em vez de "Aderido")
      criado_em: new Date().toISOString(),
    };

    batch.set(userRef, novoUsuario);

    // B. GERAR OS NOVOS 120 BILHETES FORTEMENTE TIPADOS
    for (let b = 0; b < BILHETES_POR_PESSOA; b++) {
      const numeroString = String(proximoNumeroBilhete).padStart(5, "0");
      const bilheteRef = db.collection("bilhetes").doc(numeroString);

      const novoBilhete: Bilhete = {
        numero: numeroString,
        status: "disponivel",
        vendedor_cpf: "", // Fica vazio até o usuário registrar o CPF
        vendedor_id: idAderido,
        comprador_id: null,
        data_reserva: null,
        data_pagamento: null,
        comprovante_url: null,
      };

      batch.set(bilheteRef, novoBilhete);
      proximoNumeroBilhete++;
    }

    // 4. COMITAR TUDO
    await batch.commit();

    return {
      idAderido: idAderido,
      bilhetesGerados: BILHETES_POR_PESSOA,
    };
  },
};
