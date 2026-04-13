// ============================================================================
// ARQUIVO: backend/functions/src/index.ts
// ============================================================================
// 1. INICIALIZAÇÃO GLOBAL (Agora através do ficheiro partilhado)
import "./shared/config/firebaseAdmin";

import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";

// 2. ROTEADOR MESTRE (O "Diretor de Trânsito")
import masterRouter from "./routes";

// ============================================================================
// 3. CONFIGURAÇÃO DO EXPRESS (O SERVIDOR)
// ============================================================================
const app = express();

// Segurança e formatação
app.use(cors({ origin: true }));
app.use(express.json());

// ============================================================================
// 4. DELEGAÇÃO DE ROTAS
// ============================================================================
// Rota pública de teste para ver se o servidor acordou
app.get("/status", (req, res) => {
  res.json({
    status: "API da Comissão Online",
    timestamp: new Date().toISOString(),
  });
});

// Entrega TODAS as outras chamadas da API ao nosso Roteador Mestre
// Tudo o que não for "/status", passa a ser acedido por "/api/..."
app.use("/", masterRouter);

// ============================================================================
// 5. EXPORTAÇÃO PARA CLOUD FUNCTIONS (FIREBASE V2)
// ============================================================================
export const api = onRequest(
  {
    timeoutSeconds: 180,
    memory: "512MiB",
    cors: true, // Já ativámos o cors no app.use, mas é boa prática manter na v2
  },
  app,
);
