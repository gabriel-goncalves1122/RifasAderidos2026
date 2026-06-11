// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/controllers/receberWebhookCheckoutPixController.ts
// ============================================================================
import { Request, Response } from "express";

import { RifasService } from "../rifasService";

interface RawBodyRequest extends Request {
  rawBody?: string;
}

export async function receberWebhookCheckoutPix(
  req: RawBodyRequest,
  res: Response,
) {
  try {
    const resultado = await RifasService.processarWebhookCheckoutPix({
      payload: req.body,
      rawBody: req.rawBody || JSON.stringify(req.body || {}),
      assinatura: String(req.headers?.["x-authenticity-token"] || ""),
    });

    return res.status(200).json(resultado);
  } catch (error: any) {
    if (error.message === "INVALID_SIGNATURE") {
      return res.status(401).json({ error: "Assinatura Pix inválida." });
    }

    if (error.message === "PAGAMENTO_NOT_FOUND") {
      return res.status(404).json({ error: "Pagamento Pix não encontrado." });
    }

    console.error("[RifasController] Erro no webhook Pix:", error);

    return res.status(500).json({ error: "Erro ao processar webhook Pix." });
  }
}
