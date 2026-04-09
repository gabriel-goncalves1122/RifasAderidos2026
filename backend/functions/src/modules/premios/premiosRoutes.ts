import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { premiosController } from "./premiosController";

const router = Router();

// As rotas aqui herdam o prefixo "/premios" do roteador mestre
router.get("/", premiosController.obter); // Rota Pública (Sem token)
router.post("/", validateToken, premiosController.salvarPremio);
router.put("/sorteio", validateToken, premiosController.salvarSorteio);
router.delete("/:id", validateToken, premiosController.excluirPremio);

export default router;
