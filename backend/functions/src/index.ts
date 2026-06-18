// ============================================================================
// ARQUIVO: backend/functions/src/index.ts
// ============================================================================

// Inicializa o Firebase Admin uma única vez para toda a API.
import "./shared/config/firebaseAdmin";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { onRequest } from "firebase-functions/v2/https";

import masterRouter from "./routes";
import { errorHandler } from "./shared/middlewares/errorHandler";

// ============================================================================
// CONFIGURAÇÃO DO EXPRESS
// ============================================================================

const app = express();
app.set("trust proxy", true);

// ============================================================================
// SEGURANÇA — HEADERS HTTP
// ============================================================================

app.use(helmet());

// ============================================================================
// RATE LIMITING
// ============================================================================

const getIpFallback = (req: express.Request) => {
  return req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";
};

const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getIpFallback,
  validate: { ip: false },
  message: { error: "Muitas requisições. Tente novamente em instantes.", code: "RATE_LIMIT" },
});

app.use("/auth", rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getIpFallback,
  validate: { ip: false },
  message: { error: "Muitas tentativas de autenticação. Aguarde.", code: "RATE_LIMIT" },
}));

app.use("/rifas/checkout/pix/webhook", rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getIpFallback,
  validate: { ip: false },
  message: { error: "Muitas requisições de webhook.", code: "RATE_LIMIT" },
}));

app.use(apiLimiter);

// ============================================================================
// CORS DA API EXPRESS
// ============================================================================
// Esse CORS vale apenas para a Cloud Function /api.
// Ele não controla o CORS do Firestore Emulator, Auth Emulator ou Storage Emulator.
const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      // Bloqueia se a requisição não tiver origem (ex: scripts automatizados sem falsificação de header)
      callback(new Error(`Origem ausente / bloqueada pelo CORS.`));
      return;
    }

    const origensPermitidas = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/192\.168\.0\.\d+:\d+$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,
      /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+$/,
      /^https:\/\/rifasaderidos2026\.web\.app$/,
      /^https:\/\/rifasaderidos2026\.firebaseapp\.com$/,
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

// Libera leitura de JSON e preserva o corpo bruto para validação de webhooks.
app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      (req as express.Request & { rawBody?: string }).rawBody = buf.toString(
        "utf8",
      );
    },
  }),
);

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
// MIDDLEWARE GLOBAL DE ERRO
// ============================================================================

app.use(errorHandler);

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

// ============================================================================
// AUTH TRIGGERS (v1 — coexiste com v2 sem problemas)
// ============================================================================

export { onCreateUserSetClaims } from "./modules/auth/authTriggers";
