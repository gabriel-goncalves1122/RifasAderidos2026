// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaRoutes.ts
// ============================================================================
import { Router } from "express";

import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../../shared/middlewares/authMiddleware";
import { validate } from "../../../shared/middlewares/validate";

import { secretariaController } from "./secretariaController";
import { atualizarAderidoSchema, criarAderidoSchema } from "./schemas/secretariaSchemas";

const router = Router();

// [NEW] Lista aderidos
router.get(
  "/aderidos",
  validateToken,
  requireTesourariaOrAdmin,
  secretariaController.listarAderidos,
);

// Mantém compatibilidade com o frontend: POST /admin/aderidos
router.post(
  "/aderidos",
  validateToken,
  requireTesourariaOrAdmin,
  validate(criarAderidoSchema),
  secretariaController.adicionarAderido,
);

// Mantém compatibilidade com o frontend: PUT /admin/aderidos/:id
router.put(
  "/aderidos/:id",
  validateToken,
  requireTesourariaOrAdmin,
  validate(atualizarAderidoSchema),
  secretariaController.atualizarAderido,
);

export default router;
