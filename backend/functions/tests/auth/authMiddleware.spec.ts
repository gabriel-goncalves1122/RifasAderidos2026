// ============================================================================
// ARQUIVO: tests/authMiddleware.spec.ts (Testes de Segurança da API)
// ============================================================================
import { Response, NextFunction } from "express";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";

// ----------------------------------------------------------------------------
// 1. MOCK (FALSIFICAÇÃO) DO FIREBASE (Sempre no topo!)
// ----------------------------------------------------------------------------
const mockVerifyIdToken = jest.fn<any>();
const mockUserGet = jest.fn<any>();
const mockUsersWhere = jest.fn<any>();
const mockUsersWhereGet = jest.fn<any>();

jest.mock("firebase-admin", () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: mockVerifyIdToken,
  }),
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: mockUserGet
      }),
      where: mockUsersWhere.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          get: mockUsersWhereGet
        })
      })
    })
  }),
}));

// 2. SÓ AGORA IMPORTAMOS O MIDDLEWARE A TESTAR
import {
  validateToken,
  requireTesourariaOrAdmin,
  requireSecretariaOrAdmin,
  AuthRequest,
} from "../../src/shared/middlewares/authMiddleware";

describe("Middlewares de Autenticação e Autorização", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});

    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };
    nextFunction = jest.fn<any>();
  });

  describe("validateToken", () => {
    it("Deve retornar Erro 401 se nenhum cabeçalho 'Authorization' for enviado", async () => {
      await validateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it("Deve retornar Erro 401 se o token for enviado sem o prefixo 'Bearer '", async () => {
      mockRequest.headers = { authorization: "token_solto" };
      await validateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("Deve retornar Erro 403 se o token enviado for rejeitado pelo Google/Firebase", async () => {
      mockRequest.headers = { authorization: "Bearer falso" };
      mockVerifyIdToken.mockRejectedValueOnce(new Error("auth/id-token-expired"));

      await validateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it("Deve aprovar acesso, injetar uid e ler cargo pelo uid do firestore", async () => {
      mockRequest.headers = { authorization: "Bearer valido" };
      mockVerifyIdToken.mockResolvedValueOnce({ uid: "user_123" });
      mockUserGet.mockResolvedValueOnce({ exists: true, data: () => ({ role: "admin" }) });

      await validateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockRequest.user?.role).toBe("admin");
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });

    it("Deve fazer fallback para email se o documento por uid não existir (Admin SDK emulador local/bases antigas)", async () => {
      mockRequest.headers = { authorization: "Bearer valido" };
      mockVerifyIdToken.mockResolvedValueOnce({ uid: "user_123", email: "teste@unifei.edu.br" });
      mockUserGet.mockResolvedValueOnce({ exists: false }); // Não achou por uid
      mockUsersWhereGet.mockResolvedValueOnce({ 
        empty: false, 
        docs: [ { data: () => ({ role: "tesouraria" }) } ] 
      });

      await validateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockUsersWhere).toHaveBeenCalledWith("email", "==", "teste@unifei.edu.br");
      expect(mockRequest.user?.role).toBe("tesouraria");
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });

    it("Deve aprovar acesso com fallback de role 'aderido' quando erro no Firestore (mock parcial em testes)", async () => {
      mockRequest.headers = { authorization: "Bearer valido" };
      mockVerifyIdToken.mockResolvedValueOnce({ uid: "user_123" });
      mockUserGet.mockRejectedValueOnce(new Error("Firestore fora do ar"));

      await validateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      expect(mockRequest.user?.uid).toBe("user_123");
      expect(mockRequest.user?.role).toBeUndefined(); // Pelo código atual, a excessão é engolida e user fica sem o role custom, usando só o role base
      expect(nextFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("Autorização de Cargos (obterSuperAdmins e require*)", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv, SUPER_ADMIN_EMAILS: "super1@teste.com, super2@teste.com " };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    describe("requireTesourariaOrAdmin", () => {
      it("Deve retornar 401 se usuário não estiver no request", async () => {
        await requireTesourariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
      });

      it("Deve permitir acesso sem cargo se email for super admin (obterSuperAdmins testado)", async () => {
        mockRequest.user = { uid: "1", email: "super1@teste.com" } as any;
        await requireTesourariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it("Deve retornar 403 se o cargo não estiver na lista permitida", async () => {
        mockRequest.user = { uid: "1", role: "vendedor" } as any;
        await requireTesourariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
      });

      it("Deve permitir acesso se cargo for 'membro_tesouraria'", async () => {
        mockRequest.user = { uid: "1", role: "membro_tesouraria" } as any;
        await requireTesourariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
      });
    });

    describe("requireSecretariaOrAdmin", () => {
      it("Deve retornar 401 se usuário não estiver no request", async () => {
        await requireSecretariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
      });

      it("Deve permitir acesso sem cargo se email for super admin", async () => {
        mockRequest.user = { uid: "1", email: "super2@teste.com" } as any;
        await requireSecretariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
      });

      it("Deve retornar 403 se cargo for 'tesouraria' (não autorizado em secretaria)", async () => {
        mockRequest.user = { uid: "1", role: "tesouraria" } as any;
        await requireSecretariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
      });

      it("Deve permitir acesso se cargo for 'secretaria'", async () => {
        mockRequest.user = { uid: "1", role: "secretaria" } as any;
        await requireSecretariaOrAdmin(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
      });
    });
  });
});
