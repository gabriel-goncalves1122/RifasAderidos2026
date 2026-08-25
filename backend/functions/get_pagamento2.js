const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp({ projectId: "rifasaderidos2026" });
const db = admin.firestore();

async function run() {
  const doc = await db.collection("pagamentos_pix").doc("jGYLTr3UtOWxkOS5mZLY").get();
  if (doc.exists) {
    const data = doc.data();
    if(data.raw_mercadopago) {
      console.log(`Created: ${data.raw_mercadopago.date_created}`);
      console.log(`Expiration: ${data.raw_mercadopago.date_of_expiration}`);
      console.log(`Last Updated: ${data.raw_mercadopago.date_last_updated}`);
    }
  }
}
run().catch(console.error);
