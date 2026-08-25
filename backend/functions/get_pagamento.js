const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp({ projectId: "rifasaderidos2026" });
const db = admin.firestore();

async function run() {
  const doc = await db.collection("pagamentos_pix").doc("qLrzoF7hAbJn7WT605Nu").get();
  if (doc.exists) {
    console.log(JSON.stringify(doc.data(), null, 2));
  } else {
    console.log("Not found");
  }
}
run().catch(console.error);
