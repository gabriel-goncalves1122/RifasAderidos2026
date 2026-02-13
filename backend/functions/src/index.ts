// backend/functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { validateToken, AuthRequest } from "./middlewares/authMiddleware";

// 1. Inicialização Global do Firebase Admin (Apenas uma vez)
admin.initializeApp();
const db = admin.firestore();

// 2. Inicialização do Express e Middlewares Globais
const app = express();
app.use(cors({ origin: true }));

// Configurações da Rifa
const TOTAL_BILHETES = 1000;
const PRECO_BILHETE = 10.0;

// ==========================================
// ROTAS PÚBLICAS (Não exigem login)
// ==========================================

// Rota de teste para ver se a API está online
app.get("/status", (req, res) => {
  res.json({ status: "API Online e Operante" });
});

// A sua função de Seeding, agora como uma rota do Express
app.get("/seed", async (req, res) => {
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
      const numeroFormatado = i.toString().padStart(5, "0");
      const bilheteRef = db.collection("bilhetes").doc(numeroFormatado);

      batch.set(bilheteRef, {
        numero: numeroFormatado,
        status: "disponivel", // disponivel | reservado | pago
        comprador: null,
        vendedor_id: null,
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

    // Commita o restante
    if (count > 0) {
      await batch.commit();
    }

    res.status(200).send(`Sucesso! ${totalCreated} bilhetes criados no banco.`);
  } catch (error) {
    console.error("Erro no seeding:", error);
    res.status(500).send("Erro interno ao criar bilhetes.");
  }
});

// ==========================================
// ROTAS PRIVADAS (Requerem o Token JWT)
// ==========================================

// O validateToken intercepta a requisição. Se o token for falso, ele barra aqui mesmo.
app.get("/dados-bancarios", validateToken, async (req: AuthRequest, res) => {
  try {
    // Graças ao middleware, temos certeza que req.user é o aderido logado
    const uid = req.user?.uid;
    const email = req.user?.email;

    // Futuramente, buscaremos os dados reais desse usuário no db.collection('usuarios')

    res.json({
      mensagem: "Acesso autorizado",
      dados: {
        usuario_id: uid,
        email: email,
        meta_vendas: 1200.0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ==========================================
// EXPORTAÇÃO DA API
// ==========================================
// Exportamos o app do Express encapsulado dentro de uma única Cloud Function
export const api = functions.https.onRequest(app);
