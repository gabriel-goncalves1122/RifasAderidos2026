// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/consultarCheckoutPixController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { ConsultarCheckoutPixService } from "../services/consultarCheckoutPixService";

export async function consultarCheckoutPix(req: AuthRequest, res: Response) {
  try {
    const emailLogado = req.user?.email;
    const pagamentoId = String(req.params.id || "").trim();

    if (!emailLogado) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    if (!pagamentoId) {
      return res.status(400).json({ error: "ID do pagamento inválido." });
    }

    const cobranca = await ConsultarCheckoutPixService.executar(
      emailLogado,
      pagamentoId,
    );

    return res.status(200).json(cobranca);
  } catch (error: any) {
    if (error.message === "PAGAMENTO_NOT_FOUND") {
      return res.status(404).json({ error: "Pagamento Pix não encontrado." });
    }

    console.error("[RifasController] Erro ao consultar Pix:", error);

    return res.status(500).json({ error: "Erro ao consultar pagamento Pix." });
  }
}

