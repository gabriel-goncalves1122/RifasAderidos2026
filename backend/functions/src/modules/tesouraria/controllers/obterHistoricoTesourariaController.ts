// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/obterHistoricoTesourariaController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { TesourariaService } from "../tesourariaService";

export async function obterHistoricoTesouraria(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const historico = await TesourariaService.obterHistoricoDetalhado();

    return res.status(200).json({ historico });
  } catch (error) {
    console.error(
      "[TesourariaController] Erro ao gerar histórico detalhado:",
      error,
    );

    return res
      .status(500)
      .json({ error: "Erro ao buscar o histórico de vendas." });
  }
}
