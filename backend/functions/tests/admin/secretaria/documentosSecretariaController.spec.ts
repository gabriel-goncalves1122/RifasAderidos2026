import { Response, NextFunction } from "express";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

import { documentosSecretariaController } from "../../../src/modules/admin/secretaria/documentos/documentosSecretariaController";
import { documentosSecretariaService } from "../../../src/modules/admin/secretaria/documentos/documentosSecretariaService";

jest.mock("../../../src/modules/admin/secretaria/documentos/documentosSecretariaService", () => ({
  documentosSecretariaService: {
    listarDocumentos: jest.fn(),
    criarDocumento: jest.fn(),
    atualizarDocumento: jest.fn(),
    obterConteudo: jest.fn(),
  },
}));

describe("Controller: documentosSecretariaController", () => {
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    mockNext = jest.fn() as any;
  });

  it("retorna documentos listados", async () => {
    jest
      .mocked(documentosSecretariaService.listarDocumentos)
      .mockResolvedValue([{ id: "doc-1", titulo: "Ata" } as any]);

    await documentosSecretariaController.listar({} as any, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: "doc-1", titulo: "Ata" }]);
  });

  it("retorna documento criado", async () => {
    jest
      .mocked(documentosSecretariaService.criarDocumento)
      .mockResolvedValue({ id: "doc-1", titulo: "Ata" } as any);

    await documentosSecretariaController.criar(
      {
        body: { titulo: "Ata", area: "Secretaria", tipo: "ata" },
        user: { name: "Maria" },
        documentoArquivo: {
          buffer: Buffer.from("arquivo"),
          nomeArquivo: "ata.pdf",
          mimeType: "application/pdf",
          tamanhoBytes: 7,
        },
      } as any,
      mockRes as Response,
      mockNext,
    );

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      sucesso: true,
      documento: { id: "doc-1", titulo: "Ata" },
    });
    expect(documentosSecretariaService.criarDocumento).toHaveBeenCalledWith(
      { titulo: "Ata", area: "Secretaria", tipo: "ata" },
      expect.objectContaining({ nomeArquivo: "ata.pdf" }),
      "Maria",
    );
  });

  it("repassa erro quando id de atualização é inválido", async () => {
    await documentosSecretariaController.atualizar(
      { params: {}, body: {} } as any,
      mockRes as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(documentosSecretariaService.atualizarDocumento).not.toHaveBeenCalled();
  });

  it("entrega conteúdo protegido com headers de visualização", async () => {
    jest.mocked(documentosSecretariaService.obterConteudo).mockResolvedValue({
      conteudo: Buffer.from("pdf"),
      mimeType: "application/pdf",
      nomeArquivo: "ata.pdf",
    });
    mockRes.setHeader = jest.fn() as any;
    mockRes.send = jest.fn() as any;

    await documentosSecretariaController.conteudo(
      { params: { id: "doc-1" } } as any,
      mockRes as Response,
      mockNext,
    );

    expect(mockRes.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/pdf",
    );
    expect(mockRes.send).toHaveBeenCalledWith(Buffer.from("pdf"));
  });
});
