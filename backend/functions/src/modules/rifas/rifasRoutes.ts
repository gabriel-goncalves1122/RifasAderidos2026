// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/rifasRoutes.ts
// ============================================================================
import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { rifasController } from "./rifasController";

const router = Router();

// As rotas aqui herdam o prefixo "/rifas" do roteador mestre
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

// ==========================================================================
// NOVA ROTA: Correção de rifas recusadas pelo aderido
// ==========================================================================
router.post("/corrigir", validateToken, rifasController.corrigirRecusadas);

export default router;
