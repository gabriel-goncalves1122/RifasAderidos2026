import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { authController } from "./authController";

const router = Router();

// As rotas aqui herdam o prefixo "/auth" do roteador mestre
router.post("/elegibilidade", authController.verificarElegibilidade);
router.post(
  "/completar-registo",
  validateToken,
  authController.completarRegisto,
);

export default router;
