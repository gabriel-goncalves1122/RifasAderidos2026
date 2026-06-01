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

export default corrigirRifasRoutes;
