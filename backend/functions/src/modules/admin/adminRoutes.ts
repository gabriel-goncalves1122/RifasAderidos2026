import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { compacController } from "./compacController";

const router = Router();

// As rotas aqui herdam o prefixo "/admin" do roteador mestre
router.post("/compactar", validateToken, compacController.compactarArquivos);

export default router;
