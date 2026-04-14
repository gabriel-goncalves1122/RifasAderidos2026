// ============================================================================
// ARQUIVO: tests/authMiddleware.spec.ts (Testes de Segurança da API)
// ============================================================================
import { Response, NextFunction } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// ----------------------------------------------------------------------------
// 1. MOCK (FALSIFICAÇÃO) DO FIREBASE (Sempre no topo!)
// ----------------------------------------------------------------------------
// Criamos a nossa função espiã controlável para a verificação de tokens
const mockVerifyIdToken = jest.fn<any>();

jest.mock("firebase-admin", () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: mockVerifyIdToken,
  }),
  firestore: jest.fn(),
}));

// 2. SÓ AGORA IMPORTAMOS O MIDDLEWARE A TESTAR
import {
  validateToken,
  AuthRequest,
} from "../../src/shared/middlewares/authMiddleware";

// ============================================================================
// SUÍTE DE TESTES: MIDDLEWARE DE AUTENTICAÇÃO (O "Porteiro" da API)
// ============================================================================
describe("Middleware de Autenticação JWT (validateToken)", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    // Limpamos o histórico de chamadas entre cada teste
    jest.clearAllMocks();
    // Desligamos o console.error para não poluir o terminal durante os testes que falham de propósito
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };
    // A função next() do Express que permite a requisição continuar
    nextFunction = jest.fn<any>();
  });

  // ========================================================================
  // TESTE 1: ACESSO NEGADO (Totalmente sem Cabeçalho de Autorização)
  // ========================================================================
  it("Deve retornar Erro 401 se nenhum cabeçalho 'Authorization' for enviado", async () => {
    // ACT: Passamos a request vazia (sem headers.authorization)
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    // ASSERT: Deve ser barrado imediatamente na porta
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("Faltando token"),
      }),
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // ========================================================================
  // TESTE 2: ACESSO NEGADO (Formato Errado - Faltando o "Bearer ")
  // ========================================================================
  it("Deve retornar Erro 401 se o token for enviado sem o prefixo 'Bearer '", async () => {
    // ARRANGE: Um erro comum de Front-end é mandar só o token, sem a palavra Bearer
    mockRequest.headers = { authorization: "token_solto_sem_bearer" };

    // ACT
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    // ASSERT: O middleware deve perceber que o formato é inválido
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("Faltando token"),
      }),
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // ========================================================================
  // TESTE 3: ACESSO NEGADO (Token Expirado ou Falsificado)
  // ========================================================================
  it("Deve retornar Erro 403 se o token enviado for rejeitado pelo Google/Firebase", async () => {
    // ARRANGE: Formato correto, mas token inventado
    mockRequest.headers = { authorization: "Bearer token_falso_inventado" };

    // Simulamos o motor do Google a rejeitar o token (ex: expirou há 1 hora)
    mockVerifyIdToken.mockRejectedValueOnce(new Error("auth/id-token-expired"));

    // ACT
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    // ASSERT: Barrado por ser inválido
    expect(mockVerifyIdToken).toHaveBeenCalledWith("token_falso_inventado");
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining("inválido, expirado ou revogado"),
      }),
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  // ========================================================================
  // TESTE 4: ACESSO PERMITIDO (Caminho Feliz - O VIP)
  // ========================================================================
  it("Deve aprovar o acesso (chamar next) e injetar os dados do usuário na requisição se o token for válido", async () => {
    // ARRANGE: Token perfeito
    mockRequest.headers = { authorization: "Bearer token_vip_verdadeiro" };

    // Os dados que o Google devolve quando o token é bom
    const payloadDoGoogle = {
      uid: "aluno_12345",
      email: "engenheiro_futuro@unifei.edu.br",
    };

    // Simulamos a aprovação do Google
    mockVerifyIdToken.mockResolvedValueOnce(payloadDoGoogle);

    // ACT
    await validateToken(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction,
    );

    // ASSERT
    // 1. O middleware deve ter enviado apenas a string do token para o Firebase (sem a palavra Bearer)
    expect(mockVerifyIdToken).toHaveBeenCalledWith("token_vip_verdadeiro");

    // 2. Os dados do Google têm de estar colados na requisição (req.user) para as rotas seguintes usarem
    expect(mockRequest.user).toEqual(payloadDoGoogle);

    // 3. A porta tem de ser aberta!
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled(); // Não deve devolver erros
  });
});
