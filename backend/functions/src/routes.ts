// ============================================================================
// ARQUIVO: backend/functions/src/routes.ts
// ============================================================================
import { Router } from "express";

// Importa os mini-roteadores de cada domínio
import authRoutes from "./modules/auth/authRoutes";
import rifasRoutes from "./modules/rifas/rifasRoutes";
import auditoriaRoutes from "./modules/auditoria/auditoriaRoutes";
import premiosRoutes from "./modules/premios/premiosRoutes";
import notificacoesRoutes from "./modules/notificacoes/notificacoesRoutes";
import adminRoutes from "./modules/admin/adminRoutes";

const router = Router();

// ============================================================================
// DELEGAÇÃO DE ROTAS (Redirecionamento)
// ============================================================================
router.use("/auth", authRoutes);
router.use("/rifas", rifasRoutes);
router.use("/auditorias", auditoriaRoutes);
router.use("/premios", premiosRoutes);
router.use("/notificacoes", notificacoesRoutes);
router.use("/admin", adminRoutes);

export default router;
