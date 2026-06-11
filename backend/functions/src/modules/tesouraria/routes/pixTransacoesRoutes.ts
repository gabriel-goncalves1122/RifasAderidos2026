// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/routes/pixTransacoesRoutes.ts
// ============================================================================
import { Router } from "express";

import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../../shared/middlewares/authMiddleware";
import { tesourariaController } from "../tesourariaController";

const pixTransacoesRoutes = Router();

pixTransacoesRoutes.get(
  "/transacoes-bancarias",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.listarPixTransacoes,
);

pixTransacoesRoutes.get(
  "/transacoes-bancarias/resumo",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.obterPixTransacoesResumo,
);

pixTransacoesRoutes.post(
  "/transacoes-bancarias/sincronizar",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.sincronizarPixTransacoes,
);

pixTransacoesRoutes.post(
  "/transacoes-bancarias/:transacaoId/aceitar",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.aceitarPixTransacao,
);

pixTransacoesRoutes.post(
  "/transacoes-bancarias/:transacaoId/negar",
  validateToken,
  requireTesourariaOrAdmin,
  tesourariaController.negarPixTransacao,
);

export default pixTransacoesRoutes;
