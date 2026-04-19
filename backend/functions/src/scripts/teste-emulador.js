const admin = require("firebase-admin");

// 1. O "Segredo": Aponta a conexão para o Emulador Local na porta 8080
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

// 2. Inicializa o Firebase (no emulador não precisamos de chaves, só do ID do projeto)
admin.initializeApp({ projectId: "rifasaderidos2026" });

const db = admin.firestore();

async function verificarRifas() {
  // ATENÇÃO: Substitua pelo ADERIDO_XXX que você está a usar no teste do Frontend
  const idAderido = "ADERIDO_001";

  console.log(`🔍 A ligar ao Emulador Local na porta 8080...`);
  console.log(`A procurar rifas para: ${idAderido}\n`);

  try {
    const bilhetesRef = db.collection("bilhetes");
    const querySnapshot = await bilhetesRef
      .where("vendedor_id", "==", idAderido)
      .get();

    console.log(
      `✅ Total de rifas atreladas a este aderido: ${querySnapshot.size}\n`,
    );

    let pendentes = 0;
    let recusadas = 0;
    let disponiveis = 0;
    let pagas = 0;

    querySnapshot.forEach((doc) => {
      const status = doc.data().status;
      if (status === "pendente") pendentes++;
      else if (status === "recusado") recusadas++;
      else if (status === "disponivel") disponiveis++;
      else if (status === "pago") pagas++;
      else console.log(`Rifa ${doc.id} tem um status desconhecido: ${status}`);
    });

    console.log("=========================================");
    console.log(`- ⬜ Disponíveis: ${disponiveis}`);
    console.log(`- 🟧 Pendentes:   ${pendentes}`);
    console.log(`- 🟥 Recusadas:   ${recusadas}`);
    console.log(`- 🟩 Pagas:       ${pagas}`);
    console.log("=========================================");

    // Ler a Rifa 00000 diretamente pelo ID
    const doc0 = await db.collection("bilhetes").doc("00000").get();
    console.log(`\n🕵️ RAIO-X DA RIFA 00000:`);
    console.log(`Status: ${doc0.data().status}`);
    console.log(
      `Vendedor ID que está gravado lá: "${doc0.data().vendedor_id}"`,
    );
  } catch (erro) {
    console.error("❌ Erro ao conectar ao emulador:", erro);
  }
}

verificarRifas();
