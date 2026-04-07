import * as admin from "firebase-admin";

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

if (!admin.apps.length) {
  admin.initializeApp({ projectId: "rifasaderidos2026" });
}

const db = admin.firestore();

async function resetarFilaParaTestes() {
  console.log("🧹 Iniciando a lavagem completa das rifas pendentes...");

  try {
    const snapshot = await db
      .collection("bilhetes")
      .where("status", "==", "pendente")
      .get();

    if (snapshot.empty) {
      console.log("❌ Nenhuma rifa 'pendente' encontrada.");
      return;
    }

    console.log(
      `📦 Encontradas ${snapshot.size} rifas. Removendo todo o histórico da IA...`,
    );

    const batch = db.batch();
    let contador = 0;

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        IA_resultado: admin.firestore.FieldValue.delete(),
        IA_mensagem: admin.firestore.FieldValue.delete(),
        log_automacao: admin.firestore.FieldValue.delete(), // <-- AQUI ESTAVA O SEGREDO!
      });
      contador++;
    });

    await batch.commit();
    console.log(
      `✅ ${contador} rifas limpas com sucesso! Todas são agora 'virgens' para o Motor de IA.`,
    );
    console.log(
      "👉 Passo seguinte: Ligar o Motor Python e só depois clicar em 'Auditar' no site.",
    );
  } catch (error) {
    console.error("Erro fatal:", error);
  }
}

resetarFilaParaTestes();
