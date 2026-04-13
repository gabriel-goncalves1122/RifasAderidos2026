import { Router } from "express";
import { validateToken } from "../../shared/middlewares/authMiddleware";
import { authController } from "./authController";

const router = Router();

// Rota Pública (Não precisa de token para verificar se o e-mail existe)
router.post("/elegibilidade", authController.verificarElegibilidade);

// Rota Privada (Só passa se a conta no Firebase Auth já tiver sido criada com sucesso)
router.post(
  "/completar-registo",
  validateToken,
  authController.completarRegisto,
);
// 👇 DESATIVADO: Deixámos a responsabilidade dos e-mails para o Frontend
// router.post("/recuperacao", authController.solicitarRecuperacao);

export default router;
