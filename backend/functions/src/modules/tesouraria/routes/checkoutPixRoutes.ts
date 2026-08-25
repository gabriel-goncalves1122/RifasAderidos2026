// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/routes/checkoutPixRoutes.ts
// ============================================================================
import { Router } from "express";

import { validateToken } from "../../../shared/middlewares/authMiddleware";
import { validate } from "../../../shared/middlewares/validate";
import { criarCheckoutPix } from "../controllers/criarCheckoutPixController";
import { consultarCheckoutPix } from "../controllers/consultarCheckoutPixController";
import { receberWebhookCheckoutPix } from "../controllers/receberWebhookCheckoutPixController";
import { simularPagamentoPix } from "../controllers/simularPagamentoPixController";
import { cancelarCheckoutPix } from "../controllers/cancelarCheckoutPixController";
import { checkoutPixSchema } from "../schemas/checkoutPixSchema";

const checkoutPixRoutes = Router();

checkoutPixRoutes.post(
  "/checkout/pix",
  validateToken,
  validate(checkoutPixSchema),
  criarCheckoutPix,
);

checkoutPixRoutes.get(
  "/checkout/pix/:id",
  validateToken,
  consultarCheckoutPix,
);

checkoutPixRoutes.post(
  "/checkout/pix/webhook",
  receberWebhookCheckoutPix,
);

checkoutPixRoutes.post(
  "/checkout/pix/:id/simular-pagamento",
  validateToken,
  simularPagamentoPix,
);

checkoutPixRoutes.post(
  "/checkout/pix/:id/cancelar",
  validateToken,
  cancelarCheckoutPix,
);

export default checkoutPixRoutes;
