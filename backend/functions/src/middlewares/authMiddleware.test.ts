import { validateToken, AuthRequest } from "./authMiddleware";
import { Response, NextFunction } from "express";
import * as admin from "firebase-admin";

// 1. O "MOCK" (A Simulação)
// Nós bloqueamos a comunicação real com o Google para o teste rodar rápido e offline
jest.mock("firebase-admin", () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
  }),
}));

describe("Middleware de Autenticação JWT", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  // Antes de cada teste, limpamos a lousa
  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();

    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.clearAllMocks(); // Limpa o histórico dos "espiões"
  });

  // TESTE 1: Sem Token
  it("Deve retornar Erro 401 se nenhum token for enviado", async () => {
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Não autorizado. Faltando token de autenticação (Bearer Token).",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // TESTE 2: Token Falso ou Expirado
  it("Deve retornar Erro 403 se o token for inválido", async () => {
    mockRequest.headers = { authorization: "Bearer token_falso_123" };

    // Forçamos a simulação do Firebase a dar erro
    (admin.auth().verifyIdToken as jest.Mock).mockRejectedValue(
      new Error("Token expirado"),
    );

    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Não autorizado. Token inválido, expirado ou revogado.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // TESTE 3: Token Válido (Caminho Feliz)
  it("Deve chamar next() e injetar o usuário na requisição se o token for válido", async () => {
    mockRequest.headers = { authorization: "Bearer token_verdadeiro_valido" };
    const usuarioSimulado = {
      uid: "aluno123",
      email: "engenheiro@unifei.edu.br",
    };

    // Forçamos a simulação do Firebase a validar com sucesso
    (admin.auth().verifyIdToken as jest.Mock).mockResolvedValue(
      usuarioSimulado,
    );

    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    expect(admin.auth().verifyIdToken).toHaveBeenCalledWith(
      "token_verdadeiro_valido",
    );
    expect(mockRequest.user).toEqual(usuarioSimulado); // Verifica a injeção
    expect(nextFunction).toHaveBeenCalled(); // Verifica se liberou a passagem
  });
});
