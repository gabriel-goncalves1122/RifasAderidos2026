// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/routes/corrigirRifasRoutes.ts
// ============================================================================
import { Router } from "express";

import { validateToken } from "../../../shared/middlewares/authMiddleware";
import { rifasController } from "../rifasController";

const corrigirRifasRoutes = Router();

// POST /rifas/corrigir
// Reenvia rifas recusadas para análise da tesouraria com novo comprovante.
corrigirRifasRoutes.post(
  "/corrigir",
  validateToken,
  rifasController.corrigirRecusadas,
);

// POST /rifas/corrigir-dados
// Corrige dados de rifas recusadas sem exigir novo comprovante.
corrigirRifasRoutes.post(
  "/corrigir-dados",
  validateToken,
  rifasController.corrigirDadosRifas,
);

export default corrigirRifasRoutes;
