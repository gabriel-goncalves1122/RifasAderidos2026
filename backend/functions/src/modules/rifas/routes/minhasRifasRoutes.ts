// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/routes/minhasRifasRoutes.ts
// ============================================================================
import { Router } from "express";

import { validateToken } from "../../../shared/middlewares/authMiddleware";
import { rifasController } from "../rifasController";

const minhasRifasRoutes = Router();

// GET /rifas/minhas-rifas
// Retorna os bilhetes vinculados ao aderido autenticado.
minhasRifasRoutes.get(
  "/minhas-rifas",
  validateToken,
  rifasController.getMinhasRifas,
);

export default minhasRifasRoutes;
