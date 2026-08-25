// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/tesourariaRoutes.ts
// ============================================================================
import { Router } from "express";

import pixTransacoesRoutes from "./routes/pixTransacoesRoutes";
import relatorioTesourariaRoutes from "./routes/relatorioTesourariaRoutes";
import checkoutPixRoutes from "./routes/checkoutPixRoutes";

const router = Router();

// As rotas deste arquivo herdam o prefixo "/tesouraria" do roteador mestre.
router.use(relatorioTesourariaRoutes);
router.use(pixTransacoesRoutes);
router.use(checkoutPixRoutes);

export default router;
