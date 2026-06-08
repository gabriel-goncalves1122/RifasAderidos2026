// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/sincronizarPixTransacoesController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { TesourariaService } from "../tesourariaService";

export async function sincronizarPixTransacoes(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const resultado = await TesourariaService.sincronizarPixTransacoes();

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(
      "[TesourariaController] Erro ao sincronizar transações Pix:",
      error,
    );

    return res.status(500).json({ error: "Erro ao sincronizar transações Pix." });
  }
}
