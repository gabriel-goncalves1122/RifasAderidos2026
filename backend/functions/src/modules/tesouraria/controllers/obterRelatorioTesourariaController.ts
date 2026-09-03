// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/obterRelatorioTesourariaController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { TesourariaService } from "../tesourariaService";

export async function obterRelatorioTesouraria(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const relatorio = await TesourariaService.obterRelatorioTesouraria();

    return res.status(200).json(relatorio);
  } catch (error) {
    console.error("[TesourariaController] Erro ao gerar relatório:", error);

    return res.status(500).json({ error: "Erro ao gerar relatório." });
  }
}
