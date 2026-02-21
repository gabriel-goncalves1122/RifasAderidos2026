import * as admin from "firebase-admin";

const serviceAccount = require("./chave-privada.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "rifasaderidos2026",
  });
}
const db = admin.firestore();

// A NOVA REGRA DA COMISSÃO
const BILHETES_POR_PESSOA = 120;

async function gerarBilhetes() {
  console.log("1. Buscando a lista de aderidos...");
  const snapshot = await db
    .collection("usuarios")
    .orderBy("posicao_adesao")
    .get();
  const aderidos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const totalBilhetes = aderidos.length * BILHETES_POR_PESSOA;
  console.log(`Sucesso! ${aderidos.length} aderidos encontrados.`);
  console.log(
    `2. Gerando cravados ${BILHETES_POR_PESSOA} bilhetes para cada um (Total: ${totalBilhetes})...`,
  );

  const bilhetes = [];
  let numeroAtual = 0;

  for (const aderido of aderidos) {
    for (let i = 0; i < BILHETES_POR_PESSOA; i++) {
      // Agora usamos 5 dígitos (padStart de 5) para caber os 14.280 números!
      const numeroString = String(numeroAtual).padStart(5, "0");

      bilhetes.push({
        numero: numeroString,
        status: "disponivel",
        vendedor_id: aderido.id, // O ID oficial do aderido
        comprador_id: null,
        comprovante_url: null,
        data_reserva: null,
      });
      numeroAtual++;
    }
  }

  console.log("3. Salvando os novos bilhetes no Firestore...");

  let batch = db.batch();
  let count = 0;

  for (const bilhete of bilhetes) {
    const docRef = db.collection("bilhetes").doc(bilhete.numero);
    batch.set(docRef, bilhete);
    count++;

    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
      process.stdout.write(`\rSalvos: ${count} / ${totalBilhetes}`);
    }
  }

  if (count % 400 !== 0) {
    await batch.commit();
  }

  console.log(
    `\n\n🎉 DISTRIBUIÇÃO CONCLUÍDA! ${count} bilhetes de 5 dígitos foram criados.`,
  );
}

gerarBilhetes().catch(console.error);
