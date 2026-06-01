// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/processarVendaController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { RifasService } from "../rifasService";

export async function processarVenda(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.uid || !req.user?.email) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    await RifasService.processarVenda(req.user.uid, req.user.email, req.body);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Venda registrada com sucesso! Comprovante em análise.",
    });
  } catch (error: any) {
    if (error.message === "INVALID_DATA") {
      return res
        .status(400)
        .json({ error: "Dados incompletos ou comprovante faltando." });
    }

    if (error.message === "USER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "Você não está na lista de aderidos oficiais." });
    }

    console.error("[RifasController] Erro ao processar venda:", error);

    return res.status(500).json({ error: "Erro ao processar a venda." });
  }
}
