// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/routes/relatorioRifasRoutes.ts
// ============================================================================
import { Router } from "express";

import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../../shared/middlewares/authMiddleware";
import { tesourariaController } from "../../tesouraria/tesourariaController";

const relatorioRifasRoutes = Router();

// GET /rifas/relatorio
// Retorna o resumo de arrecadação por aderido para uso da tesouraria.
relatorioRifasRoutes.get(
  "/relatorio",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.obterRelatorioTesouraria,
);

// GET /rifas/historico
// Retorna o histórico detalhado de rifas pagas e pendentes.
relatorioRifasRoutes.get(
  "/historico",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.obterHistoricoTesouraria,
);

export default relatorioRifasRoutes;
