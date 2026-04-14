import { Router } from "express";
import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../shared/middlewares/authMiddleware";
import { auditoriaController } from "./auditoriaController";

const router = Router();

// As rotas aqui herdam o prefixo "/auditoria" do roteador mestre
router.get(
  "/pendentes",
  validateToken,
  requireTesourariaOrAdmin,
  auditoriaController.listarPendentes,
);
router.post(
  "/avaliar",
  validateToken,
  requireTesourariaOrAdmin,
  auditoriaController.avaliarManual,
);
router.post(
  "/auditar-lote",
  validateToken,
  requireTesourariaOrAdmin,
  auditoriaController.auditarIA,
);

export default router;
