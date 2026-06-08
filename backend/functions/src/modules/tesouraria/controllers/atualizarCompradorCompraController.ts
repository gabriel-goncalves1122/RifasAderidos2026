// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/controllers/atualizarCompradorCompraController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { TesourariaService } from "../tesourariaService";

function normalizarTexto(valor: unknown) {
  return typeof valor === "string" ? valor.trim() : "";
}

export async function atualizarCompradorCompra(
  req: AuthRequest,
  res: Response,
) {
  const compradorId = normalizarTexto(req.params?.compradorId);
  const nome = normalizarTexto(req.body?.nome);
  const email = normalizarTexto(req.body?.email);
  const telefone = normalizarTexto(req.body?.telefone);

  if (!compradorId) {
    return res.status(400).json({
      error: "compradorId é obrigatório.",
    });
  }

  if (!nome) {
    return res.status(400).json({
      error: "Nome do comprador é obrigatório.",
    });
  }

  try {
    const compra = await TesourariaService.atualizarCompradorCompra(
      compradorId,
      {
        nome,
        email: email || null,
        telefone: telefone || null,
      },
    );

    return res.status(200).json({
      sucesso: true,
      compra,
    });
  } catch (error: any) {
    if (error?.message === "COMPRA_NAO_ENCONTRADA") {
      return res.status(404).json({
        error: "Compra não encontrada para o comprador informado.",
      });
    }

    console.error(
      "[TesourariaController] Erro ao atualizar comprador da compra:",
      error,
    );

    return res.status(500).json({
      error: "Erro ao atualizar dados do comprador.",
    });
  }
}
