import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { TesourariaService } from "../tesourariaService";

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

export async function reenviarEmailComprovante(
  req: AuthRequest,
  res: Response,
) {
  const compradorId = normalizarTexto(req.params?.compradorId);

  if (!compradorId) {
    return res.status(400).json({
      error: "compradorId é obrigatório.",
    });
  }

  try {
    const envio = await TesourariaService.reenviarEmailComprovante(compradorId);

    return res.status(200).json({
      sucesso: true,
      mensagem: "E-mail de comprovante reenviado.",
      envio,
    });
  } catch (error: any) {
    if (error?.message === "COMPRA_NAO_ENCONTRADA") {
      return res.status(404).json({
        error: "Compra não encontrada para o comprador informado.",
      });
    }

    if (error?.message === "COMPRA_NAO_PAGA") {
      return res.status(409).json({
        error: "O e-mail de comprovante só pode ser reenviado para compras pagas.",
      });
    }

    if (error?.message === "COMPRA_SEM_EMAIL") {
      return res.status(422).json({
        error: "A compra não possui e-mail do comprador.",
      });
    }

    console.error(
      "[TesourariaController] Erro ao reenviar e-mail de comprovante:",
      error,
    );

    return res.status(500).json({
      error: "Erro ao reenviar e-mail de comprovante.",
    });
  }
}
