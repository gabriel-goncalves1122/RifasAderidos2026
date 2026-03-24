import * as admin from "firebase-admin";

// ============================================================================
// 1. INICIALIZAÇÃO GLOBAL DO FIREBASE ADMIN
// ============================================================================
admin.initializeApp();

import express from "express";
import cors from "cors";

// IMPORTAÇÃO V2: O onRequest agora vem direto do pacote v2/https
import { onRequest } from "firebase-functions/v2/https";

// Middlewares e Controllers Globais
import { validateToken, AuthRequest } from "./middlewares/authMiddleware";
import { authController } from "./controllers/authController";

// Módulos de Rotas Separados
import rifasRoutes from "./routes/rifasRoutes";

// ============================================================================
// 3. CONFIGURAÇÃO DO EXPRESS (O SERVIDOR)
// ============================================================================
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// ============================================================================
// 4. ROTAS PÚBLICAS
// ============================================================================
app.get("/status", (req, res) => {
  res.json({
    status: "API da Comissão Online",
    timestamp: new Date().toISOString(),
  });
});

app.post("/auth/verificar", authController.verificarElegibilidade);

// ============================================================================
// 5. ROTAS PRIVADAS
// ============================================================================
app.get("/dados-bancarios", validateToken, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email;
    res.json({
      mensagem: "Acesso autorizado",
      dados: { usuario_id: uid, email: email },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ============================================================================
// 6. MÓDULOS DE DOMÍNIO
// ============================================================================
app.use("/rifas", rifasRoutes);

// ============================================================================
// EXPORTAÇÃO DA API PARA O CLOUD FUNCTIONS (FIREBASE V2)
// ============================================================================
export const api = onRequest(
  {
    timeoutSeconds: 180,
    memory: "512MiB",
    cors: true,
  },
  app,
);
