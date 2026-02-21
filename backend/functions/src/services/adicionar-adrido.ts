import * as admin from "firebase-admin";

const serviceAccount = require("./chave-firebase.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "rifasaderidos2026",
  });
}
const db = admin.firestore();

// ==========================================
// DADOS DO NOVO ADERIDO (MUDE AQUI QUANDO FOR USAR)
// ==========================================
const NOVO_ADERIDO = {
  nome: "JOAO RETARDATARIO DA SILVA", // Sempre em maiúsculo para manter o padrão
  curso: "ENGENHARIA MECANICA",
  email: "joao.mecanica@gmail.com",
  telefone: "35999999999",
  data_nascimento: "01/01/2000",
  genero: "male",
};

const BILHETES_POR_PESSOA = 120;

async function adicionarNovoAderido() {
  console.log(`1. Preparando para adicionar: ${NOVO_ADERIDO.nome}`);

  // 1. DESCOBRIR A POSIÇÃO DELE (Procura o último usuário cadastrado)
  const usersSnap = await db
    .collection("usuarios")
    .orderBy("posicao_adesao", "desc")
    .limit(1)
    .get();
  let proximaPosicao = 1;
  if (!usersSnap.empty) {
    proximaPosicao = usersSnap.docs[0].data().posicao_adesao + 1;
  }
  const idAderido = `ADERIDO_${String(proximaPosicao).padStart(3, "0")}`;

  // 2. DESCOBRIR DE ONDE CONTINUAR OS BILHETES (Procura o maior número de bilhete)
  const bilhetesSnap = await db
    .collection("bilhetes")
    .orderBy("numero", "desc")
    .limit(1)
    .get();
  let proximoNumeroBilhete = 0;
  if (!bilhetesSnap.empty) {
    // Pega o número (ex: "14279") e soma +1 ("14280")
    proximoNumeroBilhete = parseInt(bilhetesSnap.docs[0].id) + 1;
  }

  console.log(
    `-> Será o aderido ID: ${idAderido} (Posição: ${proximaPosicao})`,
  );
  console.log(
    `-> Receberá ${BILHETES_POR_PESSOA} bilhetes a partir do número: ${String(proximoNumeroBilhete).padStart(5, "0")}`,
  );

  const batch = db.batch();

  // 3. CRIAR O NOVO USUÁRIO NO BANCO
  const userRef = db.collection("usuarios").doc(idAderido);
  batch.set(userRef, {
    id_aderido: idAderido,
    posicao_adesao: proximaPosicao,
    nome: NOVO_ADERIDO.nome,
    curso: NOVO_ADERIDO.curso,
    email: NOVO_ADERIDO.email,
    telefone: NOVO_ADERIDO.telefone,
    data_nascimento: NOVO_ADERIDO.data_nascimento,
    genero: NOVO_ADERIDO.genero,
    status: "Aderido",
    cadastrado_em: new Date().toISOString(),
  });

  // 4. GERAR OS NOVOS 120 BILHETES CONTINUANDO A SEQUÊNCIA
  let numeroAtual = proximoNumeroBilhete;
  for (let i = 0; i < BILHETES_POR_PESSOA; i++) {
    const numeroString = String(numeroAtual).padStart(5, "0");
    const bilheteRef = db.collection("bilhetes").doc(numeroString);

    batch.set(bilheteRef, {
      numero: numeroString,
      status: "disponivel",
      vendedor_id: idAderido,
      comprador_id: null,
      comprovante_url: null,
      data_reserva: null,
    });

    numeroAtual++;
  }

  // 5. ENVIAR TUDO PARA O FIREBASE
  await batch.commit();

  console.log(
    `\n🎉 SUCESSO! ${NOVO_ADERIDO.nome} foi adicionado com a cartela terminando em ${String(numeroAtual - 1).padStart(5, "0")}.`,
  );
}

adicionarNovoAderido().catch(console.error);
