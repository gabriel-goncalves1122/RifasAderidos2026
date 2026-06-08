// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/routes/relatorioTesourariaRoutes.ts
// ============================================================================
import { Router } from "express";

import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../../shared/middlewares/authMiddleware";
import { tesourariaController } from "../tesourariaController";

const relatorioTesourariaRoutes = Router();

relatorioTesourariaRoutes.get(
  "/relatorio",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.obterRelatorioTesouraria,
);

relatorioTesourariaRoutes.get(
  "/historico",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.obterHistoricoTesouraria,
);

relatorioTesourariaRoutes.patch(
  "/historico/compras/:compradorId",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.atualizarCompradorCompra,
);

relatorioTesourariaRoutes.post(
  "/historico/compras/:compradorId/reenviar-email-comprovante",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.reenviarEmailComprovante,
);

export default relatorioTesourariaRoutes;
