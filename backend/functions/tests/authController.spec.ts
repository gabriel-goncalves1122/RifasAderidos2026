// ============================================================================
// ARQUIVO: authController.spec.ts (Testes de Regra de Negócio de Cadastro)
// ============================================================================
import { authController } from "../src/controllers/authController";
import { Request, Response } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// 1. Criamos a função espiã fora para podermos controlá-la nos testes
const mockGet = jest.fn<any>();

jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          // O TRUQUE DE MESTRE: Uma função que empurra a execução para a nossa
          // variável mockGet apenas quando ela for realmente chamada. Fuga do Hoisting!
          get: (...args: any[]) => mockGet(...args),
        }),
      }),
    }),
  }),
}));

describe("Auth Controller - Verificação de Elegibilidade", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };
    jest.clearAllMocks(); // Zera o histórico a cada teste
  });

  // TESTE 1: INTRUSO
  it("Deve bloquear o cadastro (403) se o e-mail não estiver na base oficial", async () => {
    // A - ARRANGE
    req.body.email = "intruso@unifei.edu.br";

    // Configuramos o nosso espião para simular que o banco não achou ninguém (empty: true)
    mockGet.mockResolvedValueOnce({ empty: true });

    // A - ACT
    await authController.verificarElegibilidade(
      req as Request,
      res as Response,
    );

    // A - ASSERT
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("não encontrado na lista oficial"),
      }),
    );
  });

  // TESTE 2: FORMANDO OFICIAL
  it("Deve permitir o cadastro (200) se o e-mail for de um formando", async () => {
    // A - ARRANGE
    req.body.email = "engenheiro@unifei.edu.br";

    // Configuramos o espião para simular que o banco achou a pessoa (empty: false)
    mockGet.mockResolvedValueOnce({ empty: false });

    // A - ACT
    await authController.verificarElegibilidade(
      req as Request,
      res as Response,
    );

    // A - ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
