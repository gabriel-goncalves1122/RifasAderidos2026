const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp({ projectId: "rifasaderidos2026" });
async function check() {
  const db = admin.firestore();
  const snapshot = await db.collection("usuarios").limit(5).get();
  console.log("Docs count:", snapshot.size);
  snapshot.forEach(d => console.log(d.id, d.data()));
}
check().catch(console.error);
