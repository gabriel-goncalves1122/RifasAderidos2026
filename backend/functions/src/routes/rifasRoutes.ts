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
// Adicione esta linha junto com as suas outras rotas (provavelmente perto do buscarPendentes):
router.get(
  "/relatorio",
  validateToken,
  rifasController.obterRelatorioTesouraria,
);
// Rota para puxar o histórico detalhado grão a grão (Precisa ser Tesouraria)
router.get(
  "/historico",
  validateToken,
  rifasController.obterHistoricoDetalhado,
);

// Rotas de Prêmios e Sorteio
router.get("/premios", rifasController.obterPremios); // Qualquer um pode ver
router.put("/sorteio", validateToken, rifasController.salvarInfoSorteio); // Só admin logado
router.post("/premios", validateToken, rifasController.salvarPremio);
router.delete("/premios/:id", validateToken, rifasController.excluirPremio);

export default router;
