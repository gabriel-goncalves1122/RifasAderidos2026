import { Router } from "express";
import {
  requireTesourariaOrAdmin,
  validateToken,
} from "../../shared/middlewares/authMiddleware";
import { premiosController } from "./premiosController";

const router = Router();

// As rotas aqui herdam o prefixo "/premios" do roteador mestre
router.get("/", premiosController.obter); // Rota Pública (Sem token)
router.post(
  "/",
  validateToken,
  requireTesourariaOrAdmin,
  premiosController.salvarPremio,
);
router.put(
  "/sorteio",
  validateToken,
  requireTesourariaOrAdmin,
  premiosController.salvarSorteio,
);
router.delete(
  "/:id",
  validateToken,
  requireTesourariaOrAdmin,
  premiosController.excluirPremio,
);

export default router;
