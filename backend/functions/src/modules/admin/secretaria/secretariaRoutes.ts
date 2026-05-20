// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaRoutes.ts
// ============================================================================
import { Router } from "express";

import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../../shared/middlewares/authMiddleware";

import { secretariaController } from "./secretariaController";

const router = Router();

// Mantém compatibilidade com o frontend: POST /admin/aderidos
router.post(
  "/aderidos",
  validateToken,
  requireTesourariaOrAdmin,
  secretariaController.adicionarAderido,
);

// Mantém compatibilidade com o frontend: PUT /admin/aderidos/:id
router.put(
  "/aderidos/:id",
  validateToken,
  requireTesourariaOrAdmin,
  secretariaController.atualizarAderido,
);

export default router;
