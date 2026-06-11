// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/routes/checkoutPixRoutes.ts
// ============================================================================
import { Router } from "express";

import { validateToken } from "../../../shared/middlewares/authMiddleware";
import { rifasController } from "../rifasController";

const checkoutPixRoutes = Router();

checkoutPixRoutes.post(
  "/checkout/pix",
  validateToken,
  rifasController.criarCheckoutPix,
);

checkoutPixRoutes.get(
  "/checkout/pix/:id",
  validateToken,
  rifasController.consultarCheckoutPix,
);

checkoutPixRoutes.post(
  "/checkout/pix/webhook",
  rifasController.receberWebhookCheckoutPix,
);

export default checkoutPixRoutes;

