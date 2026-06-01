// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/routes/relatorioRifasRoutes.ts
// ============================================================================
import { Router } from "express";

import { validateToken } from "../../../shared/middlewares/authMiddleware";
import { rifasController } from "../rifasController";

const relatorioRifasRoutes = Router();

// GET /rifas/relatorio
// Retorna o resumo de arrecadação por aderido para uso da tesouraria.
relatorioRifasRoutes.get(
  "/relatorio",
  validateToken,
  rifasController.obterRelatorioTesouraria,
);

// GET /rifas/historico
// Retorna o histórico detalhado de rifas pagas e pendentes.
relatorioRifasRoutes.get(
  "/historico",
  validateToken,
  rifasController.obterHistoricoDetalhado,
);

export default relatorioRifasRoutes;
