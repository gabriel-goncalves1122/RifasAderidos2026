// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/adminRoutes.ts
// ============================================================================
import { Router } from "express";

import secretariaRoutes from "./secretaria/secretariaRoutes";
import compacRoutes from "./compac/compacRoutes";

const router = Router();

// Agrega rotas administrativas da secretaria.
// Exemplo final: /admin/aderidos
router.use("/", secretariaRoutes);

// Agrega rotas administrativas de compactação.
// Exemplo final: /admin/compactar
router.use("/", compacRoutes);

export default router;
