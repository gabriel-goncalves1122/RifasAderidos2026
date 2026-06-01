// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/routes/vendaRifasRoutes.ts
// ============================================================================
import { Router } from "express";

import { validateToken } from "../../../shared/middlewares/authMiddleware";
import { rifasController } from "../rifasController";

const vendaRifasRoutes = Router();

// POST /rifas/vender
// Registra uma venda feita pelo aderido e envia o comprovante para análise.
vendaRifasRoutes.post("/vender", validateToken, rifasController.processarVenda);

export default vendaRifasRoutes;
