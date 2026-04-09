import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { rifasController } from "./rifasController";

const router = Router();

// As rotas aqui herdam o prefixo "/rifas" do roteador mestre
router.post("/vender", validateToken, rifasController.processarVenda);
router.get("/minhas-rifas", validateToken, rifasController.getMinhasRifas);
router.get(
  "/relatorio",
  validateToken,
  rifasController.obterRelatorioTesouraria,
);
router.get(
  "/historico",
  validateToken,
  rifasController.obterHistoricoDetalhado,
);

export default router;
