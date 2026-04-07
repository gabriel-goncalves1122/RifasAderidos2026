import { Router } from "express";
import { validateToken } from "../middlewares/authMiddleware";

// Importamos os nossos novos controladores refatorados
import { rifasController } from "../controllers/rifasController";
import { auditoriaController } from "../controllers/auditoriaController";
import { premiosController } from "../controllers/premiosController";
import { notificacoesController } from "../controllers/notificacoesController";
import { authController } from "../controllers/authController";

const router = Router();

// ============================================================================
// 0. ROTAS DE AUTENTICAÇÃO (authController)
// ============================================================================
router.post("/auth/elegibilidade", authController.verificarElegibilidade);
router.post(
  "/auth/completar-registo",
  validateToken,
  authController.completarRegisto,
);

// ============================================================================
// 1. ROTAS DE RIFAS, VENDAS E RELATÓRIOS (rifasController)
// ============================================================================
router.post("/vender", validateToken, rifasController.processarVenda);
router.get("/minhas-rifas", validateToken, rifasController.getMinhasRifas);
router.get(
  "/relatorio",
  validateToken,
  rifasController.obterRelatorioTesouraria,
);
router.get(
  "/historico",
  validateToken,
  rifasController.obterHistoricoDetalhado,
);

// ============================================================================
// 2. ROTAS DE AUDITORIA E INTELIGÊNCIA ARTIFICIAL (auditoriaController)
// ============================================================================
router.get("/pendentes", validateToken, auditoriaController.listarPendentes);
router.post("/avaliar", validateToken, auditoriaController.avaliarManual);
router.post("/auditar-lote", validateToken, auditoriaController.auditarIA);

// ============================================================================
// 3. ROTAS DE PRÊMIOS E SORTEIO (premiosController)
// ============================================================================
router.get("/premios", premiosController.obter); // Rota Pública (Sem token)
router.put("/sorteio", validateToken, premiosController.salvarSorteio);
router.post("/premios", validateToken, premiosController.salvarPremio);
router.delete("/premios/:id", validateToken, premiosController.excluirPremio);

// ============================================================================
// 4. ROTAS DE NOTIFICAÇÕES - SIDEBAR (notificacoesController)
// ============================================================================
router.get("/notificacoes", validateToken, notificacoesController.obter);
router.put(
  "/notificacoes/ler",
  validateToken,
  notificacoesController.marcarLidas,
);

export default router;
