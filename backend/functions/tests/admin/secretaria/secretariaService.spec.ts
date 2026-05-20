// ============================================================================
// ARQUIVO: backend/functions/tests/admin/secretaria/secretariaService.spec.ts
// ============================================================================
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

import { secretariaService } from "../../../src/modules/admin/secretaria/secretariaService";

// ============================================================================
// MOCK DO FIRESTORE ADMIN SDK
// ============================================================================

const mockGet: any = jest.fn();
const mockDoc: any = jest.fn((id: string) => ({ id }));
const mockBatchSet: any = jest.fn();
const mockBatchCommit: any = jest.fn();

jest.mock("../../../src/shared/config/firebaseAdmin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),

    // Mantém o controle do retorno de cada query no próprio teste.
    get: (..._args: any[]) => mockGet(),

    // Retorna um objeto simples para conseguirmos validar qual documento foi usado.
    doc: (...args: any[]) => mockDoc(...args),
  };

  return {
    db: {
      collection: jest.fn(() => collectionMock),
      batch: jest.fn(() => ({
        set: mockBatchSet,
        commit: mockBatchCommit,
      })),
    },
  };
});

describe("Service: secretariaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve lançar erro se o e-mail já estiver autorizado", async () => {
    mockGet.mockResolvedValueOnce({ empty: false });

    await expect(
      secretariaService.adicionarAderido({ email: "teste@teste.com" }),
    ).rejects.toThrow("Este e-mail já foi autorizado anteriormente.");

    expect(mockBatchCommit).not.toHaveBeenCalled();
  });

  it("Deve criar o primeiro aderido completo com 120 bilhetes", async () => {
    mockGet.mockResolvedValueOnce({ empty: true });
    mockGet.mockResolvedValueOnce({ empty: true });
    mockGet.mockResolvedValueOnce({ empty: true });

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

    // 1 usuário + 120 bilhetes.
    expect(mockBatchSet).toHaveBeenCalledTimes(121);
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);

    expect(mockDoc).toHaveBeenCalledWith("ADERIDO_001");
    expect(mockDoc).toHaveBeenCalledWith("00001");
    expect(mockDoc).toHaveBeenCalledWith("00120");

    const novoUsuario = mockBatchSet.mock.calls[0][1];

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
    mockGet.mockResolvedValueOnce({ empty: true });
    mockGet.mockResolvedValueOnce({ empty: true });

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

    // 1 usuário + 60 bilhetes.
    expect(mockBatchSet).toHaveBeenCalledTimes(61);

    const novoUsuario = mockBatchSet.mock.calls[0][1];

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

    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => ({ posicao_adesao: 15 }) }],
    });

    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: "01800" }],
    });

    const resultado = await secretariaService.adicionarAderido({
      email: "novo@teste.com",
    });

    expect(resultado.idAderido).toBe("ADERIDO_016");
    expect(resultado.faixaRifas).toEqual({
      inicio: "01801",
      fim: "01920",
    });

    expect(mockDoc).toHaveBeenCalledWith("ADERIDO_016");
    expect(mockDoc).toHaveBeenCalledWith("01801");
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);
  });

  it("Deve atualizar apenas campos cadastrais do aderido", async () => {
    mockGet.mockResolvedValueOnce({
      exists: true,
    });

    const mockUpdate = jest.fn();

    mockDoc.mockReturnValueOnce({
      id: "ADERIDO_001",
      get: mockGet,
      update: mockUpdate,
    });

    const resultado = await secretariaService.atualizarAderido("ADERIDO_001", {
      nome: "Gabriel Sampaio",
      telefone: "35999999999",
      modalidade_adesao: "meio",
      status_cadastro: "ativo",
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "GABRIEL SAMPAIO",
        telefone: "35999999999",
        modalidade_adesao: "meio",
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
        "modalidade_adesao",
        "status_cadastro",
        "status",
        "atualizado_em",
      ]),
    });
  });
});
