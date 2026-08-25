import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { CancelarCheckoutPixService } from "../services/cancelarCheckoutPixService";

export async function cancelarCheckoutPix(req: AuthRequest, res: Response) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const id = String(req.params.id || "");
    if (!id) {
      return res.status(400).json({ error: "ID do pagamento obrigatório." });
    }

    await CancelarCheckoutPixService.executar(uid, id);

    return res.status(200).json({ message: "Pagamento cancelado com sucesso." });
  } catch (error: any) {
    if (error.message === "PAGAMENTO_NOT_FOUND") {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }
    
    if (error.message === "STATUS_INVALIDO_CANCELAMENTO") {
      return res.status(400).json({ error: "O status atual não permite cancelamento." });
    }

    console.error("[CancelarCheckoutPixController] Erro:", error);
    return res.status(500).json({ error: "Erro ao cancelar o pagamento." });
  }
}
