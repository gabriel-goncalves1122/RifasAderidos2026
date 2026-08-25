const admin = require("firebase-admin");
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
admin.initializeApp({ projectId: "rifasaderidos2026" });
async function check() {
  const db = admin.firestore();
  const snapshot = await db.collection("usuarios").get();
  const emails = snapshot.docs.map(d => ({ id: d.id, email: d.data().email, nome: d.data().nome }));
  const gabriel = emails.filter(u => u.email && u.email.toLowerCase().includes("gabriel"));
  console.log("Gabriels:", gabriel);
}
check().catch(console.error);
