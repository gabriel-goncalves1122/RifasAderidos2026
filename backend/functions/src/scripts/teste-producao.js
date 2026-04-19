// ============================================================================
// ARQUIVO: teste-producao.js (Script Ad-Hoc para consultar a Produção)
// ============================================================================
const admin = require("firebase-admin");

// 1. Aponte para o ficheiro JSON que acabou de baixar do Firebase Console
// CUIDADO: Não envie este ficheiro para o GitHub!
const serviceAccount = require("./chave-privada.json");

// Inicializa a ligação como Administrador (ignora as regras de segurança)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function rodarTeste() {
  console.log("🔍 A conectar ao banco de produção...");
  console.log(
    "Filtro: Coleção [bilhetes] | Vendedor: [ADERIDO_030] | Status: [pendente]\n",
  );

  try {
    // A nossa "Query SQL" no formato NoSQL do Firestore
    const bilhetesRef = db.collection("bilhetes");
    const querySnapshot = await bilhetesRef
      .where("vendedor_id", "==", "ADERIDO_030")
      .where("status", "==", "pendente")
      .get();

    if (querySnapshot.empty) {
      console.log("⚠️ Nenhum bilhete encontrado com esses critérios.");
      return;
    }

    console.log(`✅ Sucesso! Encontrados ${querySnapshot.size} bilhetes.\n`);
    console.log("================ RESULTADOS ================");

    // Percorre e imprime os resultados no console
    querySnapshot.forEach((doc) => {
      const dados = doc.data();
      console.log(`🎟️ Bilhete: ${doc.id}`);
      console.log(`   Comprador: ${dados.comprador_nome || "N/A"}`);
      console.log(`   Data Reserva: ${dados.data_reserva || "N/A"}`);
      console.log(
        `   URL Comprovante: ${dados.comprovante_url ? "Anexado" : "Falta anexo"}`,
      );
      console.log("--------------------------------------------");
    });
  } catch (error) {
    console.error("❌ Erro ao consultar a base de dados:", error);
  }
}

// Executa a função
rodarTeste();
