// ============================================================================
// ARQUIVO: backend/functions/tests/authController.spec.ts
// ============================================================================
import { Request, Response } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// 1. Os Mocks do Firebase (Precisam de suportar "get", "update" e "serverTimestamp")
let mockGetDaBaseDeDados = jest.fn<any>();
let mockUpdateDaBaseDeDados = jest.fn<any>();

jest.mock("firebase-admin", () => {
  // Criamos o comportamento do banco falso
  const firestoreMock: any = jest.fn().mockReturnValue({
    collection: jest.fn<any>().mockImplementation((nomeColecao: any) => {
      if (nomeColecao !== "usuarios") {
        throw new Error(`Coleção não prevista no teste: ${nomeColecao}`);
      }
      return {
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: mockGetDaBaseDeDados,
        doc: jest.fn().mockReturnValue({
          update: mockUpdateDaBaseDeDados,
        }),
      };
    }),
  });

  // CORREÇÃO: Ensinamos o Mock a simular o relógio do servidor!
  firestoreMock.FieldValue = {
    serverTimestamp: jest.fn().mockReturnValue("15_de_outubro_simulado"),
  };

  return {
    firestore: firestoreMock,
    auth: jest.fn(),
  };
});

// Importamos só DEPOIS do mock do Firebase estar montado
import { authController, AuthRequest } from "../src/controllers/authController";

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
      mockGetDaBaseDeDados.mockResolvedValueOnce({ empty: true });

      await authController.verificarElegibilidade(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("não encontrado"),
        }),
      );
    });

    it("Deve permitir o registo (HTTP 200) se o e-mail for válido", async () => {
      req.body.email = "gabriel.engenheiro@unifei.edu.br";
      mockGetDaBaseDeDados.mockResolvedValueOnce({ empty: false });

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
      expect(mockGetDaBaseDeDados).not.toHaveBeenCalled();
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
      expect(res.json).toHaveBeenCalledWith({ error: "Não autorizado." });
    });

    it("Deve devolver erro (HTTP 404) se a conta Auth for criada, mas o documento Firestore não existir", async () => {
      // Simula o middleware de auth a passar os dados
      req.user = { uid: "firebase_xyz", email: "hacker@gmail.com" } as any;
      req.body = { nome: "Hacker", cpf: "000", telefone: "000" };

      // O Firestore não encontra ninguém
      mockGetDaBaseDeDados.mockResolvedValueOnce({ empty: true });

      await authController.completarRegisto(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(mockUpdateDaBaseDeDados).not.toHaveBeenCalled();
    });

    it("Deve atualizar o documento no Firestore (HTTP 200) ligando a conta Auth aos dados", async () => {
      req.user = { uid: "UID_OFICIAL_123", email: "gabriel@gmail.com" } as any;
      req.body = {
        nome: "Gabriel Sampaio",
        cpf: "123.456.789-00",
        telefone: "3599999999",
      };

      // Simula que o Firestore encontrou o documento criado previamente pela Tesouraria
      mockGetDaBaseDeDados.mockResolvedValueOnce({
        empty: false,
        docs: [{ id: "doc_gabriel_001", data: () => ({ nome: "Gabriel" }) }],
      });

      await authController.completarRegisto(
        req as AuthRequest,
        res as Response,
      );

      expect(mockUpdateDaBaseDeDados).toHaveBeenCalledWith(
        expect.objectContaining({
          auth_uid: "UID_OFICIAL_123",
          cpf: "123.456.789-00",
          status_cadastro: "completo",
        }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ sucesso: true }),
      );
    });
  });
});
