// ============================================================================
// ARQUIVO: backend/functions/src/index.ts
// ============================================================================

// Inicializa o Firebase Admin uma única vez para toda a API.
import "./shared/config/firebaseAdmin";

import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";

import masterRouter from "./routes";

// ============================================================================
// CONFIGURAÇÃO DO EXPRESS
// ============================================================================

const app = express();

// ============================================================================
// CORS DA API EXPRESS
// ============================================================================
// Esse CORS vale apenas para a Cloud Function /api.
// Ele não controla o CORS do Firestore Emulator, Auth Emulator ou Storage Emulator.
const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const origensPermitidas = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/192\.168\.0\.\d+:\d+$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
      /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+$/,
      /^https:\/\/.*\.web\.app$/,
      /^https:\/\/.*\.firebaseapp\.com$/,
    ];

    const origemPermitida = origensPermitidas.some((regex) =>
      regex.test(origin),
    );

    if (origemPermitida) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origem bloqueada pelo CORS: ${origin}`));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],

  credentials: true,
  optionsSuccessStatus: 204,
};

// Aplica CORS antes das rotas.
// Não use app.options("*") aqui, porque essa versão do Express quebra com "*".
app.use(cors(corsOptions));

// Libera leitura de JSON.
app.use(express.json({ limit: "10mb" }));

// ============================================================================
// ROTAS
// ============================================================================

app.get("/status", (_req, res) => {
  res.json({
    status: "API da Comissão Online",
    timestamp: new Date().toISOString(),
  });
});

app.use("/", masterRouter);

// ============================================================================
// CLOUD FUNCTIONS V2
// ============================================================================

export const api = onRequest(
  {
    timeoutSeconds: 180,
    memory: "512MiB",

    // O CORS fica centralizado no Express.
    cors: false,
  },
  app,
);
