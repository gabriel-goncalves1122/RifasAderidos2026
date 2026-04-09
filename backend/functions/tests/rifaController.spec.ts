// ============================================================================
// ARQUIVO: tests/rifasController.spec.ts (Testes do Controller de Rifas)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Response } from "express";
import { AuthRequest } from "../src/shared/middlewares/authMiddleware";

// ----------------------------------------------------------------------------
// 1. MOCK DO SERVIÇO DE RIFAS
// ----------------------------------------------------------------------------
const mockBuscarPorAderido = jest.fn<any>();
const mockProcessarVenda = jest.fn<any>();
const mockObterRelatorio = jest.fn<any>();
const mockObterHistorico = jest.fn<any>();

jest.mock("../src/modules/rifas/rifasService", () => ({
  RifasService: {
    buscarPorAderido: mockBuscarPorAderido,
    processarVenda: mockProcessarVenda,
    obterRelatorioTesouraria: mockObterRelatorio,
    obterHistoricoDetalhado: mockObterHistorico,
  },
}));

// Só importamos o controller DEPOIS do mock estar pronto
import { rifasController } from "../src/modules/rifas/rifasController";

describe("Rifas Controller", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Esconde os console.error para não poluir o terminal durante os testes de erro
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Requisição padrão válida
    req = {
      user: { uid: "user_123", email: "teste@teste.com" } as any,
      body: {},
    };

    // Resposta padrão do Express
    res = {
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };
  });

  // ========================================================================
  describe("1. getMinhasRifas()", () => {
    it("Deve retornar erro 401 se o utilizador não estiver autenticado", async () => {
      req.user = undefined; // Utilizador anónimo
      await rifasController.getMinhasRifas(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuário não autenticado.",
      });
    });

    it("Deve retornar erro 404 se o utilizador não for um aderente oficial", async () => {
      mockBuscarPorAderido.mockRejectedValueOnce(new Error("USER_NOT_FOUND"));
      await rifasController.getMinhasRifas(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("Deve retornar 200 com os bilhetes se houver sucesso", async () => {
      mockBuscarPorAderido.mockResolvedValueOnce([{ numero: "001" }]);
      await rifasController.getMinhasRifas(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ bilhetes: [{ numero: "001" }] });
    });
  });

  // ========================================================================
  describe("2. processarVenda()", () => {
    it("Deve retornar erro 401 se faltar o UID ou Email", async () => {
      req.user = { uid: "123" } as any; // Falta o email
      await rifasController.processarVenda(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("Deve retornar erro 400 se os dados forem inválidos (falta comprovativo)", async () => {
      mockProcessarVenda.mockRejectedValueOnce(new Error("INVALID_DATA"));
      await rifasController.processarVenda(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("comprovante"),
        }),
      );
    });

    it("Deve retornar 200 ao processar a venda com sucesso", async () => {
      req.body = { numeros: ["001"] };
      mockProcessarVenda.mockResolvedValueOnce(undefined); // Sucesso não devolve nada

      await rifasController.processarVenda(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockProcessarVenda).toHaveBeenCalledWith(
        "user_123",
        "teste@teste.com",
        { numeros: ["001"] },
      );
    });
  });

  // ========================================================================
  describe("3. obterRelatorioTesouraria()", () => {
    it("Deve retornar 200 com os dados do relatório", async () => {
      const dadosFalsos = { resumoGeral: { total: 100 }, aderidos: [] };
      mockObterRelatorio.mockResolvedValueOnce(dadosFalsos);

      await rifasController.obterRelatorioTesouraria(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(dadosFalsos);
    });
  });

  // ========================================================================
  describe("4. obterHistoricoDetalhado()", () => {
    it("Deve retornar 200 com o histórico", async () => {
      mockObterHistorico.mockResolvedValueOnce([{ status: "pago" }]);

      await rifasController.obterHistoricoDetalhado(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        historico: [{ status: "pago" }],
      });
    });
  });
});
