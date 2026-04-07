// ============================================================================
// ARQUIVO: tests/authController.spec.ts (Testes de Elegibilidade de Registo)
// ============================================================================
import { Request, Response } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// 1. O Mock do Firebase (Deve vir ANTES de importar o authController)
let mockGetDaBaseDeDados = jest.fn<any>();

jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn<any>().mockImplementation((nomeColecao: any) => {
      if (nomeColecao !== "usuarios") {
        throw new Error(`Coleção não prevista no teste: ${nomeColecao}`);
      }

      return {
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: mockGetDaBaseDeDados,
      };
    }),
  }),
}));

// Só importamos o controller DEPOIS do mock do Firebase estar montado
import { authController } from "../src/controllers/authController";

describe("Auth Controller - Verificação de Elegibilidade para Registo", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Restauramos os mocks antes de cada teste para evitar contaminação
    jest.clearAllMocks();

    // Configuramos objetos falsos (stubs) para os parâmetros do Express
    req = { body: {} };
    res = {
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };
  });

  // ==========================================================================
  // CENÁRIO 1: O E-MAIL NÃO CONSTA DA BASE DE DADOS (INTRUSO)
  // ==========================================================================
  it("Deve bloquear o registo (HTTP 403) se o e-mail fornecido não for de um aderente oficial", async () => {
    // ARRANGE: Preparamos o cenário
    req.body.email = "aluno_desconhecido@unifei.edu.br";

    // Simulamos que a base de dados procurou, mas não encontrou documentos
    mockGetDaBaseDeDados.mockResolvedValueOnce({ empty: true });

    // ACT: Executamos a função
    await authController.verificarElegibilidade(
      req as Request,
      res as Response,
    );

    // ASSERT: Verificamos o resultado
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("não encontrado na lista oficial"),
      }),
    );
    // Extra: Garantimos que o nosso mock "get" foi realmente chamado
    expect(mockGetDaBaseDeDados).toHaveBeenCalledTimes(1);
  });

  /// ==========================================================================
  // CENÁRIO 2: O E-MAIL PERTENCE A UM ADERENTE VÁLIDO
  // ==========================================================================
  it("Deve permitir o registo (HTTP 200) e devolver a mensagem de sucesso se o e-mail for válido", async () => {
    // ARRANGE
    req.body.email = "gabriel.engenheiro@unifei.edu.br";

    // Simulamos que a base de dados encontrou a pessoa
    mockGetDaBaseDeDados.mockResolvedValueOnce({ empty: false });

    // ACT
    await authController.verificarElegibilidade(
      req as Request,
      res as Response,
    );

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Formando elegível.", // <-- AQUI ESTAVA O ERRO!
    });
  });
  // ==========================================================================
  // CENÁRIO 3: PROTEÇÃO CONTRA CAMPOS VAZIOS (EDGE CASE)
  // ==========================================================================
  it("Deve devolver erro (HTTP 400) se não for enviado nenhum e-mail no corpo do pedido", async () => {
    // ARRANGE: Corpo vazio de forma intencional
    req.body = {};

    // ACT
    await authController.verificarElegibilidade(
      req as Request,
      res as Response,
    );

    // ASSERT: Deve falhar antes mesmo de tentar ir à base de dados
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockGetDaBaseDeDados).not.toHaveBeenCalled(); // Garante que poupámos uma ida à base de dados!
  });
});
