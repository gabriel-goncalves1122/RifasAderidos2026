// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/getMinhasRifasController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { RifasService } from "../rifasService";

export async function getMinhasRifas(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.email) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const bilhetes = await RifasService.buscarPorAderido(req.user.email);

    return res.status(200).json({ bilhetes });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "Você não está na lista de aderidos oficiais." });
    }

    console.error("[RifasController] Erro ao buscar rifas:", error);

    return res.status(500).json({ error: "Erro interno ao buscar rifas." });
  }
}
