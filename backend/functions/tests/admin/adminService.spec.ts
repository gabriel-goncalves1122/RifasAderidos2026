import { adminService } from "../../src/modules/admin/adminService";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

// ============================================================================
// MOCK AVANÇADO DO FIRESTORE (ADMIN SDK)
// ============================================================================

// O tipo ": any" impede o TS de inferir "never" e resolve todos os erros
const mockGet: any = jest.fn();
const mockDoc: any = jest.fn();
const mockBatchSet: any = jest.fn();
const mockBatchCommit: any = jest.fn();

jest.mock("../../src/shared/config/firebaseAdmin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: (...args: any[]) => mockGet(),
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

describe("Service: adminService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve atirar erro se o e-mail já estiver registado na base de dados", async () => {
    mockGet.mockResolvedValueOnce({ empty: false });

    await expect(
      adminService.adicionarAderido({ email: "teste@teste.com" }),
    ).rejects.toThrow("Este e-mail já foi autorizado anteriormente.");

    expect(mockBatchCommit).not.toHaveBeenCalled();
  });

  it("Deve criar o PRIMEIRO aderido do sistema (Posição 1, Bilhetes 00001...)", async () => {
    mockGet.mockResolvedValueOnce({ empty: true });
    mockGet.mockResolvedValueOnce({ empty: true });
    mockGet.mockResolvedValueOnce({ empty: true });

    const dados = {
      email: "primeiro@teste.com",
      nome: "Primeiro Aluno",
      curso: "Eng. Civil",
    };

    const resultado = await adminService.adicionarAderido(dados);

    expect(resultado).toEqual({
      idAderido: "ADERIDO_001",
      bilhetesGerados: 120,
    });

    expect(mockBatchSet).toHaveBeenCalledTimes(121);
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);

    expect(mockDoc).toHaveBeenCalledWith("00001");
  });

  it("Deve continuar a contagem correta se já existirem usuários e bilhetes", async () => {
    mockGet.mockResolvedValueOnce({ empty: true });

    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => ({ posicao_adesao: 15 }) }],
    });

    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: "01800" }],
    });

    const dados = { email: "novo@teste.com" };
    const resultado = await adminService.adicionarAderido(dados);

    expect(resultado.idAderido).toBe("ADERIDO_016");
    expect(mockDoc).toHaveBeenCalledWith("ADERIDO_016");
    expect(mockDoc).toHaveBeenCalledWith("01801");
    expect(mockBatchCommit).toHaveBeenCalledTimes(1);
  });
});
