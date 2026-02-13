// backend/functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Configurações da Rifa
const TOTAL_BILHETES = 1000; // Vamos começar com 1000 para teste (Free Tier friendly)
// Nota: O Free Tier permite 20k escritas/dia. Se precisar de 14.400, pode aumentar depois.
const PRECO_BILHETE = 10.0;

export const seedDatabase = functions.https.onRequest(async (req, res) => {
  const batchSize = 500; // Limite máximo do Firestore por batch
  let batch = db.batch();
  let count = 0;
  let totalCreated = 0;

  try {
    // Criação da Rifa Principal (Metadados)
    const rifaRef = db.collection("rifas").doc("formatura-2026");
    batch.set(rifaRef, {
      titulo: "Rifa Formatura Engenharia Computação",
      valor: PRECO_BILHETE,
      criado_em: new Date(),
      total_bilhetes: TOTAL_BILHETES,
    });

    // Loop para criar os bilhetes
    for (let i = 0; i < TOTAL_BILHETES; i++) {
      // Formata o número com zeros à esquerda (ex: "00042")
      const numeroFormatado = i.toString().padStart(5, "0");

      const bilheteRef = db.collection("bilhetes").doc(numeroFormatado);

      batch.set(bilheteRef, {
        numero: numeroFormatado,
        status: "disponivel", // disponivel | reservado | pago
        comprador: null,
        vendedor_id: null, // ID do formando
        data_reserva: null,
      });

      count++;

      // Se atingiu 500 operações, commita e inicia novo batch
      if (count === batchSize) {
        await batch.commit();
        console.log(`Batch commitado: ${i + 1} bilhetes processados.`);
        batch = db.batch(); // Novo batch limpo
        count = 0;
      }
      totalCreated++;
    }

    // Commita o restante (se sobrou algo no último batch)
    if (count > 0) {
      await batch.commit();
    }

    res.status(200).send(`Sucesso! ${totalCreated} bilhetes criados.`);
  } catch (error) {
    console.error("Erro no seeding:", error);
    res.status(500).send("Erro interno ao criar bilhetes.");
  }
});
