// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/compac/compacRoutes.ts
// ============================================================================
import { Router } from "express";

import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../../src/shared/middlewares/authMiddleware";

import { compacController } from "../../../src/modules/admin/compac/compacController";

const router = Router();

// Rota administrativa para compactação de arquivos/comprovantes.
router.post(
  "/compactar",
  validateToken,
  requireTesourariaOrAdmin,
  compacController.compactarArquivos,
);

export default router;
