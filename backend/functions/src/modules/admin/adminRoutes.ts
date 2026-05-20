// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/adminRoutes.ts
// ============================================================================
import { Router } from "express";

import secretariaRoutes from "./secretaria/secretariaRoutes";

const router = Router();

// Rotas administrativas da secretaria.
// Exemplo final: /admin/aderidos e /admin/aderidos/:id
router.use("/", secretariaRoutes);

export default router;
