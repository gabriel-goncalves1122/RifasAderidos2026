// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/criarCheckoutPixController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { RifasService } from "../rifasService";

export async function criarCheckoutPix(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.uid || !req.user?.email) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    const cobranca = await RifasService.criarCheckoutPix(
      req.user.uid,
      req.user.email,
      req.body,
    );

    return res.status(201).json(cobranca);
  } catch (error: any) {
    if (error.message === "INVALID_DATA") {
      return res.status(400).json({ error: "Dados incompletos para Pix." });
    }

    if (error.message === "USER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "Você não está na lista de aderidos oficiais." });
    }

    if (["RIFA_NOT_FOUND", "RIFA_INDISPONIVEL"].includes(error.message)) {
      return res.status(409).json({
        error: "Uma ou mais rifas não estão disponíveis para venda.",
      });
    }

    if (error.message === "PAGBANK_NOT_CONFIGURED") {
      return res
        .status(503)
        .json({ error: "Pagamento via Pix indisponível no momento." });
    }

    console.error("[RifasController] Erro ao criar Pix:", error);

    return res.status(500).json({ error: "Erro ao gerar pagamento via Pix." });
  }
}

