import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";

// 1. IMPORTA A CHAVE MESTRA
const serviceAccount = require("./chave-privada.json");

// 2. INICIALIZA COM A CREDENCIAL
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "rifasaderidos2026",
});
const db = admin.firestore();

async function popularBanco() {
  console.log("Iniciando a leitura do arquivo CSV consolidado...");

  const aderidosFinais: any[] = [];

  // __dirname já é a pasta 'src', então basta colocar o nome do arquivo!
  const caminhoArquivo = path.join(__dirname, "ADERIDOS_LIMPOS_ALFABETICO.csv");

  await new Promise((resolve, reject) => {
    fs.createReadStream(caminhoArquivo)
      .pipe(csv())
      .on("data", (row) => {
        const nome = row["Nome"]?.trim();
        if (!nome) return;

        const posicao = parseInt(row["Posição"] || "0");

        // Monta o objeto exatamente com as colunas do nosso novo CSV
        aderidosFinais.push({
          id_aderido: `ADERIDO_${String(posicao).padStart(3, "0")}`,
          posicao_adesao: posicao,
          nome: nome,
          curso: row["Curso"]?.trim() || "",
          email: row["E-mail"]?.trim() || "",
          telefone: row["Telefone"]?.trim() || "",
          data_nascimento: row["Data de Nascimento"]?.trim() || "",
          genero: row["Gênero"]?.trim() || "",
          status: row["Status"]?.trim() || "Aderido",
          cadastrado_em: new Date().toISOString(),
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(
    `Leitura concluída! Encontrados ${aderidosFinais.length} aderidos oficiais.`,
  );
  console.log("Iniciando envio para o Firestore em blocos...");

  // Envia para o banco usando Batch
  let batch = db.batch();
  let count = 0;

  for (const aderido of aderidosFinais) {
    const docRef = db.collection("usuarios").doc(aderido.id_aderido);
    batch.set(docRef, aderido);
    count++;

    // O Firestore aceita no máximo 500 operações por vez
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  // Comita os restantes
  if (count % 400 !== 0) {
    await batch.commit();
  }

  console.log(`SUCESSO! ${count} usuários foram salvos no banco de dados.`);
}

popularBanco().catch(console.error);
