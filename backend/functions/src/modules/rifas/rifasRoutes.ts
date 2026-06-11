// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/rifasRoutes.ts
// ============================================================================
import { Router } from "express";

import checkoutPixRoutes from "./routes/checkoutPixRoutes";
import corrigirRifasRoutes from "./routes/corrigirRifasRoutes";
import minhasRifasRoutes from "./routes/minhasRifasRoutes";
import relatorioRifasRoutes from "./routes/relatorioRifasRoutes";
import vendaRifasRoutes from "./routes/vendaRifasRoutes";

const router = Router();

// As rotas deste arquivo herdam o prefixo "/rifas" do roteador mestre.
// Cada subarquivo agrupa uma responsabilidade do domínio de rifas.
router.use(vendaRifasRoutes);
router.use(checkoutPixRoutes);
router.use(minhasRifasRoutes);
router.use(relatorioRifasRoutes);
router.use(corrigirRifasRoutes);

export default router;
