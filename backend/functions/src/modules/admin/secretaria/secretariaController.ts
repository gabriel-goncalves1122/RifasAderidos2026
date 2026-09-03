// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaController.ts
// ============================================================================
import { NextFunction, Response } from "express";

import { AuthRequest } from "../../../shared/middlewares/authMiddleware";
import { AppError } from "../../../shared/classes/AppError";
import { secretariaService } from "./secretariaService";

export const secretariaController = {
  async listarAderidos(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lista = await secretariaService.listarAderidos();
      res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  },

  async adicionarAderido(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const dadosNovos = req.body;
      const resultado = await secretariaService.adicionarAderido(dadosNovos);

      res.status(201).json({
        sucesso: true,
        mensagem: "Aderido e bilhetes gerados com sucesso!",
        ...resultado,
      });
    } catch (error: any) {
      next(error);
    }
  },

  async atualizarAderido(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError("ID_INVALIDO", "ID do aderido inválido.", 400);
      }

      const resultado = await secretariaService.atualizarAderido(
        idParam,
        req.body,
      );

      res.status(200).json({
        sucesso: true,
        mensagem: "Dados do aderido atualizados com sucesso.",
        ...resultado,
      });
    } catch (error: any) {
      next(error);
    }
  },
};
