import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { auditoriaController } from "./auditoriaController";

const router = Router();

// As rotas aqui herdam o prefixo "/auditoria" do roteador mestre
router.get("/pendentes", validateToken, auditoriaController.listarPendentes);
router.post("/avaliar", validateToken, auditoriaController.avaliarManual);
router.post("/auditar-lote", validateToken, auditoriaController.auditarIA);

export default router;
