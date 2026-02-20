import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// 1. INICIALIZE O FIREBASE ANTES DE QUALQUER OUTRA COISA!
admin.initializeApp();

// 2. SÓ DEPOIS IMPORTE O EXPRESS E SUAS ROTAS
import express from "express";
import cors from "cors";
import rifasRoutes from "./routes/rifasRoutes";
import { validateToken, AuthRequest } from "./middlewares/authMiddleware";
// ... resto do seu código (app.use, cors, etc) continua normal ...
// ============================================================================
// 1. INICIALIZAÇÃO GLOBAL DO FIREBASE ADMIN
// ============================================================================
// ATENÇÃO: Para o Firebase Storage funcionar, você precisa colocar a URL do seu bucket.
// Você encontra isso no painel do Firebase -> Storage (Ex: seu-projeto.appspot.com)

//const db = admin.firestore();

// ============================================================================
// 2. CONFIGURAÇÃO DO EXPRESS (O SERVIDOR)
// ============================================================================
const app = express();

// Middlewares Globais
app.use(cors({ origin: true }));
app.use(express.json()); // Permite que o servidor entenda JSON no body das requisições

// ============================================================================
// 3. ROTAS PÚBLICAS (Healthcheck)
// ============================================================================
app.get("/status", (req, res) => {
  res.json({
    status: "API da Comissão Online",
    timestamp: new Date().toISOString(),
  });
});

// A Rota de Seed entrará aqui futuramente, quando tivermos a planilha da turma.
// app.post("/seed-turma", ...);

// ============================================================================
// 4. ROTAS PRIVADAS (Requerem Token JWT)
// ============================================================================

// Rota de teste antiga (Mantida para fins de debug da autenticação)
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
// 5. MÓDULOS DE DOMÍNIO (Plugar as rotas separadas)
// ============================================================================
// Toda requisição que chegar em "seusite.com/api/rifas/..." será redirecionada
// para o arquivo rifasRoutes.ts que nós criamos.
app.use("/rifas", rifasRoutes);

// ============================================================================
// EXPORTAÇÃO DA API PARA O CLOUD FUNCTIONS
// ============================================================================
export const api = functions.https.onRequest(app);
