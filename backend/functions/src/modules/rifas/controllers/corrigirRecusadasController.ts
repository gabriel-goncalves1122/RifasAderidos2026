// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/corrigirRecusadasController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { RifasService } from "../rifasService";

export async function corrigirRecusadas(
  req: AuthRequest,
  res: Response,
): Promise<any> {
  try {
    const emailLogado = req.user?.email;
    const { numerosRifas, nome, telefone, email, comprovanteUrl } = req.body;

    if (!emailLogado) {
      return res.status(401).json({ error: "Utilizador não autenticado." });
    }

    if (!numerosRifas || numerosRifas.length === 0 || !comprovanteUrl) {
      return res
        .status(400)
        .json({ error: "Dados incompletos para correção." });
    }

    await RifasService.corrigirRifasRecusadas(emailLogado, numerosRifas, {
      nome,
      telefone,
      email,
      comprovanteUrl,
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Rifas reenviadas para análise com sucesso!",
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "Você não está na lista de aderidos oficiais." });
    }

    console.error("[RifasController] Erro ao corrigir rifas:", error);

    return res
      .status(500)
      .json({ error: "Erro interno ao processar correção." });
  }
}
