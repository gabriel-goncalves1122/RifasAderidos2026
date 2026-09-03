// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/corrigirDadosRifasController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { RifasService } from "../rifasService";

export async function corrigirDadosRifas(req: AuthRequest, res: Response) {
  try {
    const emailLogado = req.user?.email;
    const { numerosRifas, nome, telefone, email } = req.body;

    if (!emailLogado) {
      return res.status(401).json({ error: "Utilizador não autenticado." });
    }

    await RifasService.corrigirDadosRifasRecusadas(emailLogado, numerosRifas, {
      nome,
      telefone,
      email,
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: "Dados corrigidos e reenviados para validação.",
    });
  } catch (error: any) {
    if (error.message === "INVALID_DATA") {
      return res
        .status(400)
        .json({ error: "Dados incompletos para correção." });
    }

    if (error.message === "USER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "Você não está na lista de aderidos oficiais." });
    }

    if (error.message === "RIFAS_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: "Nenhuma rifa recusada foi encontrada." });
    }

    console.error("[RifasController] Erro ao corrigir dados:", error);

    return res
      .status(500)
      .json({ error: "Erro interno ao processar correção." });
  }
}

