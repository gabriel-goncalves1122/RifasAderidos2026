import express from "express";
import request from "supertest";

import { parseDocumentoSecretariaMultipart } from "../../../src/modules/admin/secretaria/documentos/documentosSecretariaMultipart";

describe("Middleware: documentosSecretariaMultipart", () => {
  function criarApp(arquivoObrigatorio: boolean) {
    const app = express();
    app.post(
      "/upload",
      parseDocumentoSecretariaMultipart(arquivoObrigatorio),
      (req: any, res: express.Response) => {
        res.status(200).json({
          body: req.body,
          arquivo: req.documentoArquivo
            ? {
                nomeArquivo: req.documentoArquivo.nomeArquivo,
                mimeType: req.documentoArquivo.mimeType,
                tamanhoBytes: req.documentoArquivo.tamanhoBytes,
              }
            : null,
        });
      },
      (error: any, _req: any, res: any, _next: any) => {
        res.status(error.status || 500).json({ error: error.message });
      },
    );
    return app;
  }

  it("extrai metadados e arquivo PDF", async () => {
    const response = await request(criarApp(true))
      .post("/upload")
      .field("titulo", "Ata")
      .field("area", "Secretaria")
      .attach("arquivo", Buffer.from("pdf"), {
        filename: "ata.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(200);
    expect(response.body.body).toEqual({ titulo: "Ata", area: "Secretaria" });
    expect(response.body.arquivo).toEqual({
      nomeArquivo: "ata.pdf",
      mimeType: "application/pdf",
      tamanhoBytes: 3,
    });
  });

  it("rejeita criação sem arquivo", async () => {
    const response = await request(criarApp(true))
      .post("/upload")
      .field("titulo", "Ata");

    expect(response.status).toBe(422);
    expect(response.body.error).toBe("Selecione um arquivo para enviar.");
  });
});
