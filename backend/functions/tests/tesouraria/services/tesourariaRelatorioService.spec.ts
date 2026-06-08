// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/services/tesourariaRelatorioService.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockBilhetesWhere = jest.fn<any>();
const mockBilhetesGet = jest.fn<any>();
const mockCompradorDoc = jest.fn<any>();
const mockCompradorGet = jest.fn<any>();
const mockBatchUpdate = jest.fn<any>();
const mockBatchCommit = jest.fn<any>();

const bilhetesCollectionMock = {
  where: mockBilhetesWhere.mockReturnThis(),
  get: mockBilhetesGet,
};

const compradorRefMock = {
  id: "comprador_123",
  get: mockCompradorGet,
};

const compradoresCollectionMock = {
  doc: mockCompradorDoc.mockReturnValue(compradorRefMock),
};

jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn((nome: string) => {
      if (nome === "bilhetes") return bilhetesCollectionMock;
      if (nome === "compradores") return compradoresCollectionMock;

      return {};
    }),
    batch: jest.fn().mockReturnValue({
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    }),
  }),
}));

import { TesourariaRelatorioService } from "../../../src/modules/tesouraria/services/tesourariaRelatorioService";

describe("Service: TesourariaRelatorioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCompradorDoc.mockReturnValue(compradorRefMock);
  });

  it("Deve atualizar dados do comprador nos bilhetes e no documento compradores", async () => {
    const bilheteRef001 = { path: "bilhetes/001" };
    const bilheteRef002 = { path: "bilhetes/002" };

    mockBilhetesGet.mockResolvedValueOnce({
      empty: false,
      size: 2,
      docs: [
        {
          id: "001",
          ref: bilheteRef001,
        },
        {
          id: "002",
          ref: bilheteRef002,
        },
      ],
    });
    mockCompradorGet.mockResolvedValueOnce({
      exists: true,
    });

    const resultado =
      await TesourariaRelatorioService.atualizarCompradorCompra(
        "comprador_123",
        {
          nome: "Maria Atualizada",
          email: "maria@teste.com",
          telefone: "35999990000",
        },
      );

    expect(mockBilhetesWhere).toHaveBeenCalledWith(
      "comprador_id",
      "==",
      "comprador_123",
    );
    expect(mockBatchUpdate).toHaveBeenCalledWith(bilheteRef001, {
      comprador_nome: "Maria Atualizada",
      comprador_email: "maria@teste.com",
      comprador_telefone: "35999990000",
    });
    expect(mockBatchUpdate).toHaveBeenCalledWith(bilheteRef002, {
      comprador_nome: "Maria Atualizada",
      comprador_email: "maria@teste.com",
      comprador_telefone: "35999990000",
    });
    expect(mockBatchUpdate).toHaveBeenCalledWith(compradorRefMock, {
      nome: "Maria Atualizada",
      email: "maria@teste.com",
      telefone: "35999990000",
    });
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({
      comprador_id: "comprador_123",
      nome: "Maria Atualizada",
      email: "maria@teste.com",
      telefone: "35999990000",
      rifasAtualizadas: 2,
      compradorDocumentoAtualizado: true,
    });
  });

  it("Deve atualizar bilhetes mesmo quando documento compradores não existir", async () => {
    mockBilhetesGet.mockResolvedValueOnce({
      empty: false,
      size: 1,
      docs: [
        {
          id: "003",
          ref: { path: "bilhetes/003" },
        },
      ],
    });
    mockCompradorGet.mockResolvedValueOnce({
      exists: false,
    });

    const resultado =
      await TesourariaRelatorioService.atualizarCompradorCompra(
        "comprador_sem_doc",
        {
          nome: "João",
          email: null,
          telefone: null,
        },
      );

    expect(mockBatchUpdate).toHaveBeenCalledTimes(1);
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    expect(resultado.compradorDocumentoAtualizado).toBe(false);
  });

  it("Deve lançar COMPRA_NAO_ENCONTRADA quando não houver bilhetes", async () => {
    mockBilhetesGet.mockResolvedValueOnce({
      empty: true,
      size: 0,
      docs: [],
    });

    await expect(
      TesourariaRelatorioService.atualizarCompradorCompra("inexistente", {
        nome: "Pessoa",
      }),
    ).rejects.toThrow("COMPRA_NAO_ENCONTRADA");

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockBatchCommit).not.toHaveBeenCalled();
  });
});
