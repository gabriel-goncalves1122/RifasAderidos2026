const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp({ projectId: "rifasaderidos2026" });
const db = admin.firestore();

async function run() {
  const snap = await db.collection("pagamentos_pix").orderBy("data_criacao", "desc").limit(3).get();
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Status Banco: ${data.status_pagamento_banco}`);
    console.log(`Erro Criação: ${data.erro_criacao}`);
    console.log(`Motivo recusa: ${data.motivo_recusa}`);
    if (data.raw_mercadopago) {
        console.log(`MP Status: ${data.raw_mercadopago.status}`);
        console.log(`MP Detail: ${data.raw_mercadopago.status_detail}`);
    }
    console.log('---');
  });
}
run().catch(console.error);
