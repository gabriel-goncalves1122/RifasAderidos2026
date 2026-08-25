const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp({ projectId: "rifasaderidos2026" });
const db = admin.firestore();

async function run() {
  const snap = await db.collection("pagamentos_pix").orderBy("data_criacao", "desc").limit(1).get();
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Status Banco: ${data.status_pagamento_banco}`);
    if (data.raw_mercadopago) {
      console.log(`Created: ${data.raw_mercadopago.date_created}`);
      console.log(`Expiration: ${data.raw_mercadopago.date_of_expiration}`);
      console.log(`Last Updated: ${data.raw_mercadopago.date_last_updated}`);
    }
  });
}
run().catch(console.error);
