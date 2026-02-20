import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// ============================================================================
// 1. INICIALIZAÇÃO GLOBAL DO FIREBASE ADMIN
// ============================================================================
// O Firebase deve ser inicializado antes de qualquer outra importação local
// que dependa dele (como os nossos controllers e middlewares).
admin.initializeApp();

// ============================================================================
// 2. IMPORTAÇÕES DE BIBLIOTECAS E ROTAS
// ============================================================================
import express from "express";
import cors from "cors";

// Middlewares e Controllers Globais
import { validateToken, AuthRequest } from "./middlewares/authMiddleware";
import { authController } from "./controllers/authController";

// Módulos de Rotas Separados
import rifasRoutes from "./routes/rifasRoutes";

// ============================================================================
// 3. CONFIGURAÇÃO DO EXPRESS (O SERVIDOR)
// ============================================================================
const app = express();

// Middlewares Globais
app.use(cors({ origin: true }));
app.use(express.json()); // Permite que o servidor entenda JSON no body das requisições

// ============================================================================
// 4. ROTAS PÚBLICAS (Não precisam de Token JWT)
// ============================================================================

// Healthcheck: Para monitorar se a API da comissão está viva
app.get("/status", (req, res) => {
  res.json({
    status: "API da Comissão Online",
    timestamp: new Date().toISOString(),
  });
});

// A NOVA ROTA DO PORTEIRO: Verifica se o e-mail está na lista oficial da Keeper
app.post("/auth/verificar", authController.verificarElegibilidade);

// ============================================================================
// 5. ROTAS PRIVADAS (Requerem Token JWT)
// ============================================================================

// Rota de teste (Mantida para fins de debug da autenticação)
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

// Toda requisição que chegar em "sua-api.com/rifas/..." será redirecionada
// para o arquivo rifasRoutes.ts.
app.use("/rifas", rifasRoutes);

// ============================================================================
// EXPORTAÇÃO DA API PARA O CLOUD FUNCTIONS
// ============================================================================
export const api = functions.https.onRequest(app);
