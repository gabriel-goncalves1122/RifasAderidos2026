import * as admin from "firebase-admin";
import * as crypto from "crypto";

const PROJECT_ID = "rifasaderidos2026";
const FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST;

const localApp = admin.initializeApp({
  projectId: PROJECT_ID,
});

const db = localApp.firestore();
db.settings({ host: FIRESTORE_EMULATOR_HOST, ssl: false });

export function gerarIdIndiceEmailSecretaria(email: string): string {
  const hash = crypto.createHash("md5");
  hash.update(email.trim().toLowerCase());
  return hash.digest("hex");
}

async function runBackfill() {
  console.log("🚀 Iniciando backfill de dados legados no emulador local...");

  const usuariosSnap = await db.collection("usuarios").get();
  console.log(`🔎 Encontrados ${usuariosSnap.size} usuários.`);

  let batch = db.batch();
  let count = 0;
  let ultimaPosicao = 0;

  for (const doc of usuariosSnap.docs) {
    const usuario = doc.data();
    
    // 1. Criar indices_usuarios_email
    if (usuario.email) {
      const emailId = gerarIdIndiceEmailSecretaria(usuario.email);
      const indiceRef = db.collection("indices_usuarios_email").doc(emailId);
      batch.set(indiceRef, {
        email: usuario.email,
        usuario_id: doc.id,
        criado_em: usuario.criado_em || new Date().toISOString(),
      });
    }

    // 2. Achar a maior posição
    if (usuario.posicao_adesao && usuario.posicao_adesao > ultimaPosicao) {
      ultimaPosicao = usuario.posicao_adesao;
    }

    count++;
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
      console.log(`   ↳ ${count} índices criados...`);
    }
  }

  if (count % 400 !== 0) {
    await batch.commit();
  }
  console.log(`✅ Coleção [indices_usuarios_email] preenchida. Total: ${count}`);

  // 3. Atualizar contadores/aderidos
  console.log("🔎 Procurando o último bilhete gerado...");
  const bilhetesSnap = await db.collection("bilhetes")
    .orderBy("numero", "desc")
    .limit(1)
    .get();
  
  let ultimoBilhete = 0;
  if (!bilhetesSnap.empty) {
    ultimoBilhete = parseInt(bilhetesSnap.docs[0].id, 10);
  }

  if (ultimaPosicao > 0 || ultimoBilhete > 0) {
    console.log(`📊 Atualizando contadores/aderidos: ultima_posicao=${ultimaPosicao}, ultimo_bilhete=${ultimoBilhete}`);
    await db.collection("contadores").doc("aderidos").set({
      ultima_posicao: ultimaPosicao,
      ultimo_bilhete: ultimoBilhete,
    }, { merge: true });
    console.log("✅ Contador atualizado.");
  }

  console.log("\n🎉 BACKFILL CONCLUÍDO!");
}

runBackfill()
  .then(async () => {
    await Promise.all(admin.apps.map((app) => app?.delete()));
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("\n❌ Erro no backfill:", error);
    await Promise.all(admin.apps.map((app) => app?.delete()));
    process.exit(1);
  });
