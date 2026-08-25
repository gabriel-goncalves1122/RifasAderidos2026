const admin = require("firebase-admin");

// Aponta o Admin SDK para os emuladores locais
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

// No emulador, a base importada foi alocada em 'demo-rifasaderidos2026'
admin.initializeApp({ projectId: "demo-rifasaderidos2026" });
const db = admin.firestore();

async function checkUser() {
  console.log("=== INICIANDO VERIFICAÇÃO DE USUÁRIOS ===");
  
  // 1. Tenta buscar ADERIDO_000 diretamente
  const doc000 = await db.collection("usuarios").doc("ADERIDO_000").get();
  if (doc000.exists) {
    console.log("✅ ADERIDO_000 Encontrado:", doc000.data());
  } else {
    console.log("❌ ADERIDO_000 não existe no banco de dados.");
  }

  // 2. Tenta buscar ADERIDO_001 (Gabriel Sampaio)
  const doc001 = await db.collection("usuarios").doc("ADERIDO_001").get();
  if (doc001.exists) {
    console.log("\n✅ ADERIDO_001 Encontrado! Dados:");
    console.log(JSON.stringify(doc001.data(), null, 2));
  }

  // 3. Verifica no Firebase Auth
  const auth = admin.auth();
  try {
    const authUser = await auth.getUserByEmail("gabrielsampaio059@gmail.com");
    console.log(`\n✅ Usuário Auth encontrado para gabrielsampaio059@gmail.com:`);
    console.log(`- UID: ${authUser.uid}`);
    console.log(`- Custom Claims (Cargos):`, authUser.customClaims);
  } catch (err) {
    console.log(`\n❌ Usuário não encontrado no Firebase Auth Emulator.`);
    console.log(`Isso significa que você ainda não fez login no emulador desde a última importação, ou a conta não foi salva no banco local do Auth.`);
  }

  console.log("\n=== FIM DA VERIFICAÇÃO ===");
}

checkUser();
