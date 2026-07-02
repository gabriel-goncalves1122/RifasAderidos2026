import { NextFunction, Response } from "express";

import { AuthRequest } from "../../../../shared/middlewares/authMiddleware";
import { AppError } from "../../../../shared/classes/AppError";
import { documentosSecretariaService } from "./documentosSecretariaService";
import type { DocumentoMultipartRequest } from "./documentosSecretariaMultipart";

export const documentosSecretariaController = {
  async listar(
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const documentos = await documentosSecretariaService.listarDocumentos();
      res.status(200).json(documentos);
    } catch (error) {
      next(error);
    }
  },

  async criar(
    req: DocumentoMultipartRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.documentoArquivo) {
        throw new AppError(
          "DOCUMENTO_SECRETARIA_ARQUIVO_OBRIGATORIO",
          "Selecione um arquivo para enviar.",
          422,
        );
      }

      const autorNome =
        req.user?.name || req.user?.email || "Secretaria";
      const documento = await documentosSecretariaService.criarDocumento(
        req.body,
        req.documentoArquivo,
        autorNome,
      );
      res.status(201).json({ sucesso: true, documento });
    } catch (error) {
      next(error);
    }
  },

  async atualizar(
    req: DocumentoMultipartRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError(
          "DOCUMENTO_SECRETARIA_ID_INVALIDO",
          "ID do documento inválido.",
          400,
        );
      }

      const documento = await documentosSecretariaService.atualizarDocumento(
        idParam,
        req.body,
        req.documentoArquivo,
      );
      res.status(200).json({ sucesso: true, documento });
    } catch (error) {
      next(error);
    }
  },

  async conteudo(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        throw new AppError(
          "DOCUMENTO_SECRETARIA_ID_INVALIDO",
          "ID do documento inválido.",
          400,
        );
      }

      const arquivo = await documentosSecretariaService.obterConteudo(idParam);
      res.setHeader("Content-Type", arquivo.mimeType);
      res.setHeader("Cache-Control", "private, max-age=300");
      res.setHeader(
        "Content-Disposition",
        `inline; filename*=UTF-8''${encodeURIComponent(arquivo.nomeArquivo)}`,
      );
      res.status(200).send(arquivo.conteudo);
    } catch (error) {
      next(error);
    }
  },
};
