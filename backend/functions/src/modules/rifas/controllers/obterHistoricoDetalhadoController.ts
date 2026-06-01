// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/obterHistoricoDetalhadoController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { RifasService } from "../rifasService";

export async function obterHistoricoDetalhado(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const historico = await RifasService.obterHistoricoDetalhado();

    return res.status(200).json({ historico });
  } catch (error) {
    console.error("[RifasController] Erro ao gerar histórico detalhado:", error);

    return res
      .status(500)
      .json({ error: "Erro ao buscar o histórico de vendas." });
  }
}
