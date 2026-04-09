import * as admin from "firebase-admin";

// 1. Carrega a chave de produção
const serviceAccount = require("./chave-privada.json");

// ============================================================================
// CONFIGURAÇÃO DAS DUAS CONEXÕES
// ============================================================================

// Conexão 1: PRODUÇÃO (De onde vamos LER os dados)
const prodApp = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    projectId: "rifasaderidos2026",
  },
  "PRODUCAO", // Nomeamos a conexão para não dar conflito
);
const dbProd = prodApp.firestore();

// Conexão 2: LOCAL / EMULADOR (Onde vamos GRAVAR os dados)
const localApp = admin.initializeApp(
  {
    projectId: "rifasaderidos2026",
  },
  "LOCAL",
);
const dbLocal = localApp.firestore();

// Força a conexão LOCAL a apontar para o emulador na sua máquina
dbLocal.settings({
  host: "localhost:8080", // Certifique-se de que esta é a porta do seu emulador Firestore
  ssl: false,
});

// Coleções que queremos copiar da produção para o teste
const COLECOES_PARA_COPIAR = [
  "usuarios",
  "bilhetes",
  "compradores",
  "premios",
  "configuracoes",
];

async function copiarBancoParaLocal() {
  console.log("🚀 Iniciando a cópia da PRODUÇÃO para o LOCAL...");

  for (const nomeColecao of COLECOES_PARA_COPIAR) {
    console.log(`\n📦 Lendo coleção: [${nomeColecao}] da Produção...`);

    const snapshot = await dbProd.collection(nomeColecao).get();

    if (snapshot.empty) {
      console.log(
        `⚠️ A coleção [${nomeColecao}] está vazia na produção. Pulando.`,
      );
      continue;
    }

    console.log(
      `Encontrados ${snapshot.size} documentos. Copiando para o Emulador...`,
    );

    // Usamos Batch para gravar de 400 em 400 documentos (limite do Firestore é 500)
    let batch = dbLocal.batch();
    let count = 0;
    let totalCopiado = 0;

    for (const doc of snapshot.docs) {
      const docRefLocal = dbLocal.collection(nomeColecao).doc(doc.id);
      batch.set(docRefLocal, doc.data());

      count++;
      totalCopiado++;

      // Quando atinge 400, "commita" no banco e abre um novo batch
      if (count === 400) {
        await batch.commit();
        batch = dbLocal.batch();
        count = 0;
      }
    }

    // Commita o resto que sobrou (ex: se tinham 450 docs, commita os últimos 50)
    if (count > 0) {
      await batch.commit();
    }

    console.log(
      `✅ Coleção [${nomeColecao}] copiada com sucesso! (${totalCopiado} documentos)`,
    );
  }

  console.log(
    "\n🎉 CÓPIA FINALIZADA COM SUCESSO! O seu emulador local agora é um clone da produção.",
  );
}

copiarBancoParaLocal()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erro fatal ao copiar o banco:", error);
    process.exit(1);
  });
