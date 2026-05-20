// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/compac/compacRoutes.ts
// ============================================================================
import { Router } from "express";

import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../../shared/middlewares/authMiddleware";

import { compacController } from "./compacController";

const router = Router();

// Rota administrativa para compactação de arquivos.
router.post(
  "/compactar",
  validateToken,
  requireTesourariaOrAdmin,
  compacController.compactarArquivos,
);

export default router;
