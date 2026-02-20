import { Router } from "express";
import { rifasController } from "../controllers/rifasController";
import { validateToken } from "../middlewares/authMiddleware";

const router = Router();

// ============================================================================
// ROTAS DE ADERIDOS (Membros comuns)
// ============================================================================
router.post("/vender", validateToken, rifasController.processarVenda);
router.get("/minhas-rifas", validateToken, rifasController.getMinhasRifas);

// ============================================================================
// ROTAS DA TESOURARIA (Admin)
// ============================================================================
router.get("/pendentes", validateToken, rifasController.listarPendentes);
router.post("/avaliar", validateToken, rifasController.avaliarComprovante);

export default router;
