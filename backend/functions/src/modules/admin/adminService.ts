import { db } from "../../shared/config/firebaseAdmin";

export const adminService = {
  async adicionarAderido(dadosNovos: any) {
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
      const ultimaPosicao = usersSnap.docs[0].data().posicao_adesao;
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
    const batch = db.batch(); // No Admin SDK é db.batch() em vez de writeBatch(db)

    // A. CRIAR O NOVO USUÁRIO
    const idAderido = `ADERIDO_${String(proximaPosicao).padStart(3, "0")}`;
    const userRef = db.collection("usuarios").doc(idAderido);

    batch.set(userRef, {
      id_aderido: idAderido,
      posicao_adesao: proximaPosicao,
      email: emailLimpo,
      nome: dadosNovos.nome ? String(dadosNovos.nome).toUpperCase() : "",
      curso: dadosNovos.curso ? String(dadosNovos.curso).toUpperCase() : "",
      data_nascimento: dadosNovos.dataNascimento || "",
      telefone: dadosNovos.telefone || "",
      cargo: dadosNovos.cargo || "aderido",
      status: "Aderido",
      cadastrado_em: new Date().toISOString(),
      uid: null, // Indica que é pendente (ainda não ativou a conta com password)
    });

    // B. GERAR OS NOVOS 120 BILHETES PARA ESTE ALUNO
    for (let b = 0; b < BILHETES_POR_PESSOA; b++) {
      const numeroString = String(proximoNumeroBilhete).padStart(5, "0");
      const bilheteRef = db.collection("bilhetes").doc(numeroString);

      batch.set(bilheteRef, {
        numero: numeroString,
        status: "disponivel",
        vendedor_id: idAderido,
        comprador_id: null,
        comprovante_url: null,
        data_reserva: null,
      });

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
