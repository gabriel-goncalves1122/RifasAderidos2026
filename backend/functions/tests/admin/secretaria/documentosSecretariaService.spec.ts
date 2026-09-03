import { jest, describe, beforeEach, it, expect } from "@jest/globals";

import { documentosSecretariaService } from "../../../src/modules/admin/secretaria/documentos/documentosSecretariaService";

const mockGet: any = jest.fn();
const mockSet: any = jest.fn();
const mockDocGet: any = jest.fn();
const mockDoc: any = jest.fn();
const mockOrderBy: any = jest.fn();
const mockRunTransaction: any = jest.fn();
const mockTransactionGet: any = jest.fn();
const mockTransactionUpdate: any = jest.fn();
const mockStorageSalvar: any = jest.fn();
const mockStorageRemover: any = jest.fn();
const mockStorageBaixar: any = jest.fn();

jest.mock("../../../src/shared/config/firebaseAdmin", () => {
  const collectionMock = {
    orderBy: (...args: any[]) => mockOrderBy(...args),
    get: (...args: any[]) => mockGet(...args),
    doc: (...args: any[]) => mockDoc(...args),
  };

  return {
    db: {
      collection: jest.fn(() => collectionMock),
      runTransaction: (...args: any[]) => mockRunTransaction(...args),
    },
  };
});

jest.mock("../../../src/modules/admin/secretaria/documentos/documentosSecretariaStorageService", () => ({
  documentosSecretariaStorageService: {
    salvar: (...args: any[]) => mockStorageSalvar(...args),
    remover: (...args: any[]) => mockStorageRemover(...args),
    baixar: (...args: any[]) => mockStorageBaixar(...args),
  },
}));

const dadosDocumento = {
  titulo: "Ata",
  area: "Secretaria",
  tipo: "ata",
  nomeArquivo: "ata.pdf",
  mimeType: "application/pdf",
  tamanhoBytes: 100,
  storagePath: "documentos_secretaria/secretaria/ata/ata.pdf",
  urlVisualizacao: "https://example.com/ata.pdf",
  autorNome: "Secretaria",
};

const arquivoDocumento = {
  buffer: Buffer.from("%PDF-arquivo"),
  nomeArquivo: "ata.pdf",
  mimeType: "application/pdf",
  tamanhoBytes: 12,
};

describe("Service: documentosSecretariaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOrderBy.mockReturnValue({ get: mockGet });
    mockDoc.mockReturnValue({ id: "doc-1", set: mockSet, get: mockDocGet });
    mockStorageRemover.mockResolvedValue(undefined);
    mockStorageSalvar.mockResolvedValue(undefined);
    mockRunTransaction.mockImplementation(async (callback: any) =>
      callback({
        get: mockTransactionGet,
        update: mockTransactionUpdate,
      }),
    );
  });

  it("lista documentos ordenados por atualização", async () => {
    mockGet.mockResolvedValueOnce({
      docs: [
        {
          id: "doc-1",
          data: () => ({
            ...dadosDocumento,
            criadoEm: "2026-06-01T00:00:00.000Z",
            atualizadoEm: "2026-06-01T00:00:00.000Z",
          }),
        },
      ],
    });

    const resultado = await documentosSecretariaService.listarDocumentos();

    expect(mockOrderBy).toHaveBeenCalledWith("atualizadoEm", "desc");
    expect(resultado[0]).toEqual(expect.objectContaining({ id: "doc-1", titulo: "Ata" }));
  });

  it("cria documento com datas", async () => {
    const resultado = await documentosSecretariaService.criarDocumento(
      {
        titulo: "Ata",
        area: "Secretaria",
        tipo: "ata",
      },
      arquivoDocumento,
      "Secretaria",
    );

    expect(mockStorageSalvar).toHaveBeenCalledWith(
      expect.objectContaining({
        buffer: arquivoDocumento.buffer,
        mimeType: "application/pdf",
      }),
    );
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: "Ata",
        criadoEm: expect.any(String),
        atualizadoEm: expect.any(String),
      }),
    );
    expect(resultado).toEqual(expect.objectContaining({ id: "doc-1", titulo: "Ata" }));
  });

  it("remove arquivo novo se a gravação dos metadados falhar", async () => {
    mockSet.mockRejectedValueOnce(new Error("firestore indisponível"));

    await expect(
      documentosSecretariaService.criarDocumento(
        { titulo: "Ata", area: "Secretaria", tipo: "ata" },
        arquivoDocumento,
        "Secretaria",
      ),
    ).rejects.toThrow("firestore indisponível");

    expect(mockStorageRemover).toHaveBeenCalledWith(expect.stringContaining("doc-1"));
  });

  it("rejeita arquivo cujo conteúdo não corresponde ao MIME", async () => {
    await expect(
      documentosSecretariaService.criarDocumento(
        { titulo: "Ata", area: "Secretaria", tipo: "ata" },
        { ...arquivoDocumento, buffer: Buffer.from("html disfarçado") },
        "Secretaria",
      ),
    ).rejects.toThrow("O conteúdo do arquivo não corresponde ao formato informado.");

    expect(mockStorageSalvar).not.toHaveBeenCalled();
  });

  it("atualiza documento existente em transação", async () => {
    mockDoc.mockReturnValue({ id: "doc-1" });
    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      id: "doc-1",
      data: () => ({
        ...dadosDocumento,
        criadoEm: "2026-06-01T00:00:00.000Z",
        atualizadoEm: "2026-06-01T00:00:00.000Z",
      }),
    });

    const resultado = await documentosSecretariaService.atualizarDocumento("doc-1", {
      titulo: "Ata atualizada",
    });

    expect(mockTransactionUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ titulo: "Ata atualizada" }),
    );
    expect(resultado.titulo).toBe("Ata atualizada");
  });

  it("substitui arquivo e remove o anterior somente após atualizar metadados", async () => {
    mockDocGet.mockResolvedValueOnce({
      exists: true,
      data: () => dadosDocumento,
    });
    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      id: "doc-1",
      data: () => ({
        ...dadosDocumento,
        criadoEm: "2026-06-01T00:00:00.000Z",
        atualizadoEm: "2026-06-01T00:00:00.000Z",
      }),
    });

    await documentosSecretariaService.atualizarDocumento(
      "doc-1",
      { titulo: "Ata nova" },
      arquivoDocumento,
    );

    expect(mockStorageSalvar).toHaveBeenCalled();
    expect(mockTransactionUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ nomeArquivo: "ata.pdf" }),
    );
    expect(mockStorageRemover).toHaveBeenCalledWith(dadosDocumento.storagePath);
  });

  it("baixa conteúdo usando o caminho persistido", async () => {
    mockDocGet.mockResolvedValueOnce({
      exists: true,
      id: "doc-1",
      data: () => ({
        ...dadosDocumento,
        criadoEm: "2026-06-01T00:00:00.000Z",
        atualizadoEm: "2026-06-01T00:00:00.000Z",
      }),
    });
    mockStorageBaixar.mockResolvedValueOnce(Buffer.from("conteudo"));

    const resultado = await documentosSecretariaService.obterConteudo("doc-1");

    expect(mockStorageBaixar).toHaveBeenCalledWith(dadosDocumento.storagePath);
    expect(resultado.mimeType).toBe("application/pdf");
  });
});
