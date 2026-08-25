const admin = require("firebase-admin");

// Configura para usar o emulador do Firestore e Auth
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

admin.initializeApp({
  projectId: "rifasaderidos2026",
});

const db = admin.firestore();
const auth = admin.auth();

async function checkUser() {
  try {
    console.log("Procurando por ADERIDO_000...");
    
    // Tenta buscar no Firestore
    const usuariosRef = db.collection("usuarios");
    
    // Podemos tentar buscar pelo ID do documento se for ADERIDO_000,
    // ou por um campo aderidoId/matricula/numero
    const doc1 = await usuariosRef.doc("ADERIDO_000").get();
    
    let userData = null;
    let userId = null;

    if (doc1.exists) {
      console.log("Usuário encontrado pelo ID do documento 'ADERIDO_000'.");
      userData = doc1.data();
      userId = doc1.id;
    } else {
      console.log("Documento com ID 'ADERIDO_000' não encontrado. Buscando por campos (aderidoId, id_aderido, etc)...");
      const snapshot = await usuariosRef.where("id_aderido", "==", "ADERIDO_000").get();
      if (!snapshot.empty) {
        userData = snapshot.docs[0].data();
        userId = snapshot.docs[0].id;
        console.log(`Usuário encontrado no documento ID: ${userId}`);
      } else {
        const snapshot2 = await usuariosRef.where("aderidoId", "==", "ADERIDO_000").get();
        if (!snapshot2.empty) {
          userData = snapshot2.docs[0].data();
          userId = snapshot2.docs[0].id;
          console.log(`Usuário encontrado no documento ID: ${userId}`);
        } else {
          // Última tentativa: listar os primeiros usuários para entender a estrutura
          console.log("Listando os primeiros 3 usuários para entender a estrutura:");
          const allDocs = await usuariosRef.limit(3).get();
          allDocs.forEach(d => console.log(d.id, d.data()));
        }
      }
    }

    if (userData) {
      console.log("--- DADOS DO FIRESTORE ---");
      console.log(JSON.stringify(userData, null, 2));

      // Verifica Auth (Claims) se existir um email ou uid associado
      const email = userData.email;
      if (email) {
        try {
          const authUser = await auth.getUserByEmail(email);
          console.log("--- DADOS DO AUTH (CLAIMS) ---");
          console.log(JSON.stringify(authUser.customClaims || {}, null, 2));
        } catch (e) {
          console.log(`Erro ao buscar usuário no Auth pelo email ${email}:`, e.message);
        }
      } else {
        console.log("Usuário sem email no Firestore, pulando verificação do Auth.");
      }
    } else {
      console.log("ADERIDO_000 não foi encontrado nas buscas.");
    }
    
  } catch (error) {
    console.error("Erro na execução do script:", error);
  }
}

checkUser();
