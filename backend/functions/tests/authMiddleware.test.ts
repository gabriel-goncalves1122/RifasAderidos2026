// ============================================================================
// ARQUIVO: authMiddleware.test.ts (Testes de Segurança da API)
// ============================================================================

import { validateToken, AuthRequest } from "../src/middlewares/authMiddleware";
import { Response, NextFunction } from "express";
import * as admin from "firebase-admin";

// ----------------------------------------------------------------------------
// 1. MOCK (FALSIFICAÇÃO) DO FIREBASE
// ----------------------------------------------------------------------------
// Nós bloqueamos a comunicação real com o Google para o teste rodar rápido e offline.
// Substituímos o "verifyIdToken" por uma função espiã vazia (jest.fn()).
jest.mock("firebase-admin", () => {
  return {
    auth: jest.fn().mockReturnValue({
      verifyIdToken: jest.fn(),
    }),
    firestore: jest.fn(),
  };
});

describe("Middleware de Autenticação JWT", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  // Antes de CADA teste, "limpamos a lousa" para não haver vazamento de dados
  beforeEach(() => {
    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(), // mockReturnThis permite encadear: res.status().json()
      json: jest.fn(),
    };
    nextFunction = jest.fn(); // Função "next" do Express

    // Desligamos o console.error no terminal durante os testes para a tela ficar limpa
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  // ========================================================================
  // TESTE 1: ACESSO NEGADO (Sem Token)
  // ========================================================================
  it("Deve retornar Erro 401 se nenhum token for enviado", async () => {
    // A - ARRANGE (O cenário já foi preparado no beforeEach, sem headers)

    // A - ACT (Executamos o porteiro)
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    // A - ASSERT (Verificamos se o porteiro barrou)
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Não autorizado. Faltando token de autenticação (Bearer Token).",
    });
    expect(nextFunction).not.toHaveBeenCalled(); // Garante que a requisição NÃO passou pra frente
  });

  // ========================================================================
  // TESTE 2: ACESSO NEGADO (Token Falso/Expirado)
  // ========================================================================
  it("Deve retornar Erro 403 se o token for inválido", async () => {
    // A - ARRANGE: Simulamos alguém mandando um token inventado
    mockRequest.headers = { authorization: "Bearer token_falso_123" };

    // Forçamos a simulação do Firebase a dar erro (como se dissesse: "esse token não existe!")
    (admin.auth().verifyIdToken as jest.Mock).mockRejectedValue(
      new Error("Token expirado"),
    );

    // A - ACT
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    // A - ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Não autorizado. Token inválido, expirado ou revogado.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // ========================================================================
  // TESTE 3: ACESSO PERMITIDO (Caminho Feliz)
  // ========================================================================
  it("Deve chamar next() e injetar o usuário na requisição se o token for válido", async () => {
    // A - ARRANGE: Simulamos um token bom
    mockRequest.headers = { authorization: "Bearer token_verdadeiro_valido" };
    const usuarioSimulado = {
      uid: "aluno123",
      email: "engenheiro@unifei.edu.br",
    };

    // Forçamos a simulação do Firebase a validar com sucesso e devolver o usuário
    (admin.auth().verifyIdToken as jest.Mock).mockResolvedValue(
      usuarioSimulado,
    );

    // A - ACT
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    // A - ASSERT
    // 1. Verifica se chamou a biblioteca do Google com o token certo
    expect(admin.auth().verifyIdToken).toHaveBeenCalledWith(
      "token_verdadeiro_valido",
    );
    // 2. Verifica se o middleware injetou os dados do usuário na requisição (req.user)
    expect(mockRequest.user).toEqual(usuarioSimulado);
    // 3. Verifica se o porteiro abriu a porta (next() chamado)
    expect(nextFunction).toHaveBeenCalled();
  });
});
