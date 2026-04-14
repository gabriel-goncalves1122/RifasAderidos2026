import { Router } from "express";
import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../shared/middlewares/authMiddleware";
import { compacController } from "./compacController";
import { adminController } from "./adminController";

const router = Router();

// As rotas aqui herdam o prefixo "/admin" do roteador mestre
router.post(
  "/compactar",
  validateToken,
  requireTesourariaOrAdmin,
  compacController.compactarArquivos,
);
router.post(
  "/aderidos",
  validateToken,
  requireTesourariaOrAdmin,
  adminController.adicionarAderido,
);
export default router;
