// ============================================================================
// ARQUIVO: backend/functions/tests/authController.spec.ts
// ============================================================================
import { Request, Response } from "express";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// 1. Em vez de mockar a base de dados inteira, mockamos apenas o authService!
jest.mock("../../src/modules/auth/authService", () => ({
  authService: {
    verificarElegibilidade: jest.fn(),
    completarRegisto: jest.fn(),
  },
}));

// Importamos o serviço mockado para podermos alterar o seu comportamento nos testes
import { authService } from "../../src/modules/auth/authService";
import { authController } from "../../src/modules/auth/authController";
import { AuthRequest } from "../../src/shared/middlewares/authMiddleware"; // Certifique-se que a pasta é 'middlewares'

describe("Auth Controller - Verificação e Conclusão de Registo", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };
  });

  // ==========================================================================
  // BLOCO A: TESTES DE ELEGIBILIDADE (verificarElegibilidade)
  // ==========================================================================
  describe("Função: verificarElegibilidade", () => {
    it("Deve bloquear o registo (HTTP 403) se o e-mail fornecido não for oficial", async () => {
      req.body.email = "aluno_desconhecido@unifei.edu.br";

      // Simulamos que o serviço respondeu que NÃO é elegível (false)
      jest
        .mocked(authService.verificarElegibilidade)
        .mockResolvedValueOnce(false);

      await authController.verificarElegibilidade(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("não encontrado na lista oficial"),
        }),
      );
    });

    it("Deve permitir o registo (HTTP 200) se o e-mail for válido", async () => {
      req.body.email = "gabriel.engenheiro@unifei.edu.br";

      // Simulamos que o serviço respondeu que É elegível (true)
      // Substitua: (authService.verificarElegibilidade as jest.Mock).mockResolvedValueOnce(true);
      // Por isto:
      jest
        .mocked(authService.verificarElegibilidade)
        .mockResolvedValueOnce(true);

      await authController.verificarElegibilidade(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        sucesso: true,
        mensagem: "Formando elegível.",
      });
    });

    it("Deve devolver erro (HTTP 400) se o e-mail for vazio (Edge Case)", async () => {
      req.body = {};
      await authController.verificarElegibilidade(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(authService.verificarElegibilidade).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // BLOCO B: TESTES DE CONCLUSÃO (completarRegisto)
  // ==========================================================================
  describe("Função: completarRegisto", () => {
    it("Deve rejeitar a requisição (HTTP 401) se o token do usuário não for injetado pelo middleware", async () => {
      // req.user propositadamente undefined
      await authController.completarRegisto(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Sessão inválida ou não autorizado.",
      });
    });

    it("Deve devolver erro (HTTP 404) se a conta Auth for criada, mas o documento Firestore não existir", async () => {
      req.user = { uid: "firebase_xyz", email: "hacker@gmail.com" } as any;
      req.body = { nome: "Hacker", cpf: "000", telefone: "000" };

      // Substitua: (authService.completarRegisto as jest.Mock).mockRejectedValueOnce(new Error("USUARIO_NAO_ENCONTRADO"));
      // Por isto:
      jest
        .mocked(authService.completarRegisto)
        .mockRejectedValueOnce(new Error("USUARIO_NAO_ENCONTRADO"));

      await authController.completarRegisto(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Ficha de aderido não encontrada na base de dados.",
      });
    });

    it("Deve retornar sucesso (HTTP 200) chamando o authService corretamente", async () => {
      req.user = { uid: "UID_OFICIAL_123", email: "gabriel@gmail.com" } as any;
      req.body = {
        nome: "Gabriel Sampaio",
        cpf: "123.456.789-00",
        telefone: "3599999999",
      };

      // Substitua: (authService.completarRegisto as jest.Mock).mockResolvedValueOnce(undefined);
      // Por isto:
      jest
        .mocked(authService.completarRegisto)
        .mockResolvedValueOnce(undefined);

      await authController.completarRegisto(
        req as AuthRequest,
        res as Response,
      );

      // Verificamos se o Controller passou os dados corretos para o Service (A regra de ouro!)
      expect(authService.completarRegisto).toHaveBeenCalledWith(
        "gabriel@gmail.com",
        "UID_OFICIAL_123",
        {
          nome: "Gabriel Sampaio",
          cpf: "123.456.789-00",
          telefone: "3599999999",
        },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ sucesso: true }),
      );
    });
  });
});
