import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { notificacoesController } from "./notificacoesController";

const router = Router();

// As rotas aqui herdam o prefixo "/notificacoes" do roteador mestre
router.get("/", validateToken, notificacoesController.obter);
router.put("/ler", validateToken, notificacoesController.marcarLidas);

export default router;
