import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { compacController } from "./compacController";
import { adminController } from "./adminController";

const router = Router();

// As rotas aqui herdam o prefixo "/admin" do roteador mestre
router.post("/compactar", validateToken, compacController.compactarArquivos);
router.post("/aderidos", validateToken, adminController.adicionarAderido);
export default router;
