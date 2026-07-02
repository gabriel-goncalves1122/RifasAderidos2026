import { Router } from "express";

import {
  requireSecretariaOrAdmin,
  validateToken,
} from "../../../../shared/middlewares/authMiddleware";
import { validate } from "../../../../shared/middlewares/validate";

import { documentosSecretariaController } from "./documentosSecretariaController";
import {
  atualizarDocumentoSecretariaSchema,
  criarDocumentoSecretariaSchema,
} from "./documentosSecretariaSchemas";
import { parseDocumentoSecretariaMultipart } from "./documentosSecretariaMultipart";

const router = Router();

router.get(
  "/",
  validateToken,
  requireSecretariaOrAdmin,
  documentosSecretariaController.listar,
);

router.post(
  "/",
  validateToken,
  requireSecretariaOrAdmin,
  parseDocumentoSecretariaMultipart(true),
  validate(criarDocumentoSecretariaSchema),
  documentosSecretariaController.criar,
);

router.put(
  "/:id",
  validateToken,
  requireSecretariaOrAdmin,
  parseDocumentoSecretariaMultipart(false),
  validate(atualizarDocumentoSecretariaSchema),
  documentosSecretariaController.atualizar,
);

router.get(
  "/:id/conteudo",
  validateToken,
  requireSecretariaOrAdmin,
  documentosSecretariaController.conteudo,
);

export default router;
