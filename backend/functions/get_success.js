const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp({ projectId: "rifasaderidos2026" });
const db = admin.firestore();

async function run() {
  const snap = await db.collection("pagamentos_pix").where("status_pagamento_banco", "in", ["PAID", "AUTHORIZED", "approved", "pago"]).orderBy("data_criacao", "desc").limit(1).get();
  if (snap.empty) {
    console.log("No successful payment found.");
    // try any
    const snap2 = await db.collection("pagamentos_pix").orderBy("data_criacao", "desc").limit(1).get();
    snap2.forEach(doc => {
      console.log(`LATEST ANY STATUS: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
    });
    return;
  }
  snap.forEach(doc => {
    console.log(`SUCCESS ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });
}
run().catch(console.error);
