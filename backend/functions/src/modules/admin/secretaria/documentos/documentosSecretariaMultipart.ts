import Busboy from "busboy";
import { NextFunction, Response } from "express";

import { AppError } from "../../../../shared/classes/AppError";
import type { AuthRequest } from "../../../../shared/middlewares/authMiddleware";
import type { ArquivoDocumentoSecretaria } from "./documentosSecretariaTypes";
import { LIMITE_DOCUMENTO_SECRETARIA_BYTES } from "./documentosSecretariaUploadHelper";

export interface DocumentoMultipartRequest extends AuthRequest {
  documentoArquivo?: ArquivoDocumentoSecretaria;
  rawBody?: Buffer | string;
}

export function parseDocumentoSecretariaMultipart(arquivoObrigatorio: boolean) {
  return async (
    req: DocumentoMultipartRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      next(
        new AppError(
          "DOCUMENTO_SECRETARIA_MULTIPART_OBRIGATORIO",
          "Envie os dados como multipart/form-data.",
          415,
        ),
      );
      return;
    }

    try {
      const { campos, arquivo } = await new Promise<{
        campos: Record<string, string>;
        arquivo?: ArquivoDocumentoSecretaria;
      }>((resolve, reject) => {
        const campos: Record<string, string> = {};
        let arquivoRecebido: ArquivoDocumentoSecretaria | undefined;
        let falhou = false;
        const parser = Busboy({
          headers: req.headers,
          limits: {
            files: 1,
            fileSize: LIMITE_DOCUMENTO_SECRETARIA_BYTES,
            fields: 20,
          },
        });

        parser.on("field", (nome, valor) => {
          campos[nome] = valor;
        });

        parser.on("file", (_nome, stream, info) => {
          const partes: Buffer[] = [];

          stream.on("data", (parte: Buffer) => partes.push(parte));
          stream.on("limit", () => {
            falhou = true;
            reject(
              new AppError(
                "DOCUMENTO_SECRETARIA_TAMANHO_INVALIDO",
                "O arquivo deve ter no máximo 25 MB.",
                422,
              ),
            );
          });
          stream.on("end", () => {
            if (falhou) return;
            const buffer = Buffer.concat(partes);
            arquivoRecebido = {
              buffer,
              nomeArquivo: info.filename,
              mimeType: info.mimeType,
              tamanhoBytes: buffer.length,
            };
          });
        });

        parser.on("error", reject);
        parser.on("finish", () => {
          if (!falhou) resolve({ campos, arquivo: arquivoRecebido });
        });

        const rawBody = req.rawBody;
        if (rawBody) {
          parser.end(Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody));
        } else {
          req.pipe(parser);
        }
      });

      if (arquivoObrigatorio && !arquivo) {
        throw new AppError(
          "DOCUMENTO_SECRETARIA_ARQUIVO_OBRIGATORIO",
          "Selecione um arquivo para enviar.",
          422,
        );
      }

      req.body = campos;
      req.documentoArquivo = arquivo;
      next();
    } catch (error) {
      next(error);
    }
  };
}
