// ============================================================================
// ARQUIVO: backend/functions/tests/admin/secretaria/secretariaService.spec.ts
// ============================================================================
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

import { secretariaService } from "../../../src/modules/admin/secretaria/secretariaService";

// ============================================================================
// MOCK DO FIRESTORE ADMIN SDK
// ============================================================================

const mockGet: any = jest.fn();
const mockDoc: any = jest.fn((id: string) => ({ id, get: mockDocGet, set: mockDocSet }));
const mockDocGet: any = jest.fn();
const mockDocSet: any = jest.fn();
const mockRunTransaction: any = jest.fn();

jest.mock("../../../src/shared/config/firebaseAdmin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
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

const mockTransactionSet: any = jest.fn();
const mockTransactionGet: any = jest.fn();

describe("Service: secretariaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockRunTransaction.mockImplementation(async (callback: any) => {
      return callback({
        get: mockTransactionGet,
        set: mockTransactionSet,
      });
    });
  });

  it("Deve lançar erro se o e-mail já estiver autorizado", async () => {
    mockGet.mockResolvedValueOnce({ empty: false });

    await expect(
      secretariaService.adicionarAderido({ email: "teste@teste.com" }),
    ).rejects.toThrow("Este e-mail já foi autorizado anteriormente.");

    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("Deve criar o primeiro aderido completo com 120 bilhetes", async () => {
    mockGet.mockResolvedValueOnce({ empty: true });
    mockDocGet.mockResolvedValueOnce({ exists: false });
    mockGet.mockResolvedValueOnce({ empty: true });
    mockGet.mockResolvedValueOnce({ empty: true });
    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ ultima_posicao: 0, ultimo_bilhete: 0 }),
    });

    const resultado = await secretariaService.adicionarAderido({
      email: "primeiro@teste.com",
      nome: "Primeiro Aluno",
      curso: "Engenharia Civil",
      modalidade_adesao: "completo",
    });

    expect(resultado).toEqual({
      idAderido: "ADERIDO_001",
      modalidade: "completo",
      bilhetesGerados: 120,
      faixaRifas: {
        inicio: "00001",
        fim: "00120",
      },
    });

    expect(mockTransactionSet).toHaveBeenCalledTimes(122);
    expect(mockRunTransaction).toHaveBeenCalledTimes(1);

    expect(mockDoc).toHaveBeenCalledWith("ADERIDO_001");
    expect(mockDoc).toHaveBeenCalledWith("00001");
    expect(mockDoc).toHaveBeenCalledWith("00120");

    const novoUsuario = mockTransactionSet.mock.calls[0][1];

    expect(novoUsuario).toEqual(
      expect.objectContaining({
        id: "ADERIDO_001",
        email: "primeiro@teste.com",
        nome: "PRIMEIRO ALUNO",
        curso: "ENGENHARIA CIVIL",
        cargo: "aderido",
        modalidade_adesao: "completo",
        meta_vendas: 1200,
        status: "pendente",
        status_cadastro: "pendente",
      }),
    );
  });

  it("Deve criar meio-aderido com 60 bilhetes e meta reduzida", async () => {
    mockGet.mockResolvedValueOnce({ empty: true });
    mockDocGet.mockResolvedValueOnce({ exists: false });
    mockGet.mockResolvedValueOnce({ empty: true });
    mockGet.mockResolvedValueOnce({ empty: true });
    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ ultima_posicao: 0, ultimo_bilhete: 0 }),
    });

    const resultado = await secretariaService.adicionarAderido({
      email: "meio@teste.com",
      nome: "Meio Aderido",
      modalidade_adesao: "meio",
    });

    expect(resultado).toEqual({
      idAderido: "ADERIDO_001",
      modalidade: "meio",
      bilhetesGerados: 60,
      faixaRifas: {
        inicio: "00001",
        fim: "00060",
      },
    });

    expect(mockTransactionSet).toHaveBeenCalledTimes(62);

    const novoUsuario = mockTransactionSet.mock.calls[0][1];

    expect(novoUsuario).toEqual(
      expect.objectContaining({
        modalidade_adesao: "meio",
        meta_vendas: 600,
        faixa_rifas: {
          inicio: "00001",
          fim: "00060",
        },
      }),
    );
  });

  it("Deve continuar a contagem se já existirem usuários e bilhetes", async () => {
    mockGet.mockResolvedValueOnce({ empty: true });
    mockDocGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ ultima_posicao: 15, ultimo_bilhete: 1800 }),
    });
    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({ ultima_posicao: 15, ultimo_bilhete: 1800 }),
    });

    const resultado = await secretariaService.adicionarAderido({
      email: "novo@teste.com",
      modalidade_adesao: "completo",
    });

    expect(resultado.idAderido).toBe("ADERIDO_016");
    expect(resultado.faixaRifas).toEqual({
      inicio: "01801",
      fim: "01920",
    });

    expect(mockDoc).toHaveBeenCalledWith("ADERIDO_016");
    expect(mockDoc).toHaveBeenCalledWith("01801");
    expect(mockRunTransaction).toHaveBeenCalledTimes(1);
  });

  it("Deve atualizar apenas campos cadastrais do aderido", async () => {
    const mockUpdate = jest.fn();

    mockDoc.mockReturnValueOnce({
      id: "ADERIDO_001",
      get: mockGet,
      update: mockUpdate,
    });

    mockGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        status_cadastro: "ativo",
        modalidade_adesao: "completo",
      }),
    });

    const resultado = await secretariaService.atualizarAderido("ADERIDO_001", {
      nome: "Gabriel Sampaio",
      telefone: "35999999999",
      status_cadastro: "ativo",
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "GABRIEL SAMPAIO",
        telefone: "35999999999",
        status_cadastro: "ativo",
        status: "ativo",
        atualizado_em: expect.any(String),
      }),
    );

    expect(resultado).toEqual({
      idAderido: "ADERIDO_001",
      camposAtualizados: expect.arrayContaining([
        "nome",
        "telefone",
        "status_cadastro",
        "status",
        "atualizado_em",
      ]),
    });
  });
});
