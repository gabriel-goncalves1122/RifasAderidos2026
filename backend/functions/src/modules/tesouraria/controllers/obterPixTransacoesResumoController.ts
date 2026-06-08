// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/obterPixTransacoesResumoController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { TesourariaService } from "../tesourariaService";

export async function obterPixTransacoesResumo(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const resumo = await TesourariaService.obterPixTransacoesResumo();

    return res.status(200).json({ resumo });
  } catch (error) {
    console.error("[TesourariaController] Erro ao gerar resumo Pix:", error);

    return res.status(500).json({ error: "Erro ao gerar resumo Pix." });
  }
}
