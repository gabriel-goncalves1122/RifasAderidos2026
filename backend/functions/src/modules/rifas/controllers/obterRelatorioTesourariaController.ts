// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/obterRelatorioTesourariaController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { RifasService } from "../rifasService";

export async function obterRelatorioTesouraria(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const relatorio = await RifasService.obterRelatorioTesouraria();

    return res.status(200).json(relatorio);
  } catch (error) {
    console.error("[RifasController] Erro ao gerar relatório:", error);

    return res.status(500).json({ error: "Erro ao gerar relatório." });
  }
}
