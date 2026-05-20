// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaController.ts
// ============================================================================
import { Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { secretariaService } from "./secretariaService";

export const secretariaController = {
  async adicionarAderido(req: AuthRequest, res: Response): Promise<any> {
    try {
      const dadosNovos = req.body;

      if (!dadosNovos.email) {
        return res.status(400).json({ error: "O e-mail é obrigatório." });
      }

      const resultado = await secretariaService.adicionarAderido(dadosNovos);

      return res.status(201).json({
        sucesso: true,
        mensagem: "Aderido e bilhetes gerados com sucesso!",
        ...resultado,
      });
    } catch (error: any) {
      console.error(
        "[Secretaria Controller] Erro ao adicionar aderido:",
        error,
      );

      return res.status(400).json({
        error: error.message || "Erro desconhecido ao adicionar aderido.",
      });
    }
  },

  async atualizarAderido(req: AuthRequest, res: Response): Promise<any> {
    try {
      const idParam = req.params.id;

      // Garante que a rota recebeu um único ID válido antes de chamar o service.
      if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: "ID do aderido inválido." });
      }

      const resultado = await secretariaService.atualizarAderido(
        idParam,
        req.body,
      );

      return res.status(200).json({
        sucesso: true,
        mensagem: "Dados do aderido atualizados com sucesso.",
        ...resultado,
      });
    } catch (error: any) {
      console.error(
        "[Secretaria Controller] Erro ao atualizar aderido:",
        error,
      );

      const statusCode =
        error.message === "Aderido não encontrado." ? 404 : 400;

      return res.status(statusCode).json({
        error: error.message || "Erro desconhecido ao atualizar aderido.",
      });
    }
  },
};
