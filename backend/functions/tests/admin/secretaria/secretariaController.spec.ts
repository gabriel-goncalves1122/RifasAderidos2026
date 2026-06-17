// ============================================================================
// ARQUIVO: backend/functions/tests/admin/secretaria/secretariaController.spec.ts
// ============================================================================
import { Request, Response, NextFunction } from "express";
import {
  jest,
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from "@jest/globals";

import { secretariaController } from "../../../src/modules/admin/secretaria/secretariaController";
import { secretariaService } from "../../../src/modules/admin/secretaria/secretariaService";

jest.mock("../../../src/modules/admin/secretaria/secretariaService", () => ({
  secretariaService: {
    adicionarAderido: jest.fn(),
    atualizarAderido: jest.fn(),
  },
}));

describe("Controller: secretariaController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: any;

  beforeEach(() => {
    jest.clearAllMocks();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    mockNext = jest.fn() as any;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("Deve repassar o erro via next se o body for invalido ou ocorrer erro", async () => {
    mockReq = {
      body: {
        email: "duplicado@teste.com",
      },
    };

    const erroSimulado = new Error(
      "Este e-mail já foi autorizado anteriormente.",
    );

    jest
      .mocked(secretariaService.adicionarAderido)
      .mockRejectedValue(erroSimulado);

    await secretariaController.adicionarAderido(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(erroSimulado);
  });

  it("Deve retornar 201 quando o aderido for criado com sucesso", async () => {
    mockReq = {
      body: {
        email: "joao@teste.com",
        nome: "João",
        modalidade_adesao: "completo",
      },
    };

    const mockResultadoService = {
      idAderido: "ADERIDO_001",
      modalidade: "completo" as const,
      bilhetesGerados: 120,
      faixaRifas: {
        inicio: "00001",
        fim: "00120",
      },
    };

    jest
      .mocked(secretariaService.adicionarAderido)
      .mockResolvedValue(mockResultadoService);

    await secretariaController.adicionarAderido(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(secretariaService.adicionarAderido).toHaveBeenCalledWith(
      mockReq.body,
    );

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Aderido e bilhetes gerados com sucesso!",
      idAderido: "ADERIDO_001",
      modalidade: "completo",
      bilhetesGerados: 120,
      faixaRifas: {
        inicio: "00001",
        fim: "00120",
      },
    });
  });

  it("Deve repassar erro via next se o ID de atualização for inválido", async () => {
    mockReq = {
      params: {},
      body: {
        nome: "Novo Nome",
      },
    };

    await secretariaController.atualizarAderido(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(secretariaService.atualizarAderido).not.toHaveBeenCalled();
  });

  it("Deve retornar 200 quando atualizar o aderido com sucesso", async () => {
    mockReq = {
      params: {
        id: "ADERIDO_001",
      },
      body: {
        nome: "Gabriel Atualizado",
      },
    };

    jest.mocked(secretariaService.atualizarAderido).mockResolvedValue({
      idAderido: "ADERIDO_001",
      camposAtualizados: ["nome", "atualizado_em"],
    });

    await secretariaController.atualizarAderido(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(secretariaService.atualizarAderido).toHaveBeenCalledWith(
      "ADERIDO_001",
      mockReq.body,
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Dados do aderido atualizados com sucesso.",
      idAderido: "ADERIDO_001",
      camposAtualizados: ["nome", "atualizado_em"],
    });
  });

  it("Deve repassar erro via next quando o aderido não for encontrado", async () => {
    mockReq = {
      params: {
        id: "ADERIDO_999",
      },
      body: {
        nome: "Inexistente",
      },
    };

    const erro = new Error("Aderido não encontrado.");
    jest
      .mocked(secretariaService.atualizarAderido)
      .mockRejectedValue(erro);

    await secretariaController.atualizarAderido(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(erro);
  });
});
