// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/listarPixTransacoesController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { TesourariaService } from "../tesourariaService";

export async function listarPixTransacoes(_req: AuthRequest, res: Response) {
  try {
    const transacoes = await TesourariaService.buscarPixTransacoes();

    return res.status(200).json({ transacoes });
  } catch (error) {
    console.error("[TesourariaController] Erro ao buscar transações Pix:", error);

    return res.status(500).json({ error: "Erro ao buscar transações Pix." });
  }
}
