// ============================================================================
// ARQUIVO: tests/notificacoesController.spec.ts (Testes do Controller de Notificações)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Response } from "express";
import { AuthRequest } from "../../src/shared/middlewares/authMiddleware";

const mockBuscarPorEmailAderido = jest.fn<any>();
const mockMarcarComoLidas = jest.fn<any>();

jest.mock("../../src/modules/notificacoes/notificacoesService", () => ({
  NotificacoesService: {
    buscarPorEmailAderido: mockBuscarPorEmailAderido,
    marcarComoLidas: mockMarcarComoLidas,
  },
}));

import { notificacoesController } from "../../src/modules/notificacoes/notificacoesController";

describe("Notificações Controller", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { user: { uid: "123", email: "teste@teste.com" } as any, body: {} };
    res = { status: jest.fn<any>().mockReturnThis(), json: jest.fn<any>() };
  });

  describe("obter()", () => {
    it("Deve retornar 401 se o usuário não tiver email", async () => {
      req.user = { uid: "123" } as any; // Sem email
      await notificacoesController.obter(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("Deve retornar 200 com as notificações", async () => {
      mockBuscarPorEmailAderido.mockResolvedValueOnce([{ id: "msg1" }]);
      await notificacoesController.obter(req as AuthRequest, res as Response);

      expect(mockBuscarPorEmailAderido).toHaveBeenCalledWith("teste@teste.com");
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("marcarLidas()", () => {
    it("Deve retornar 400 se 'ids' não for um array", async () => {
      req.body = { ids: "msg1" }; // Erro proposital
      await notificacoesController.marcarLidas(
        req as AuthRequest,
        res as Response,
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("Deve retornar 200 ao marcar como lidas", async () => {
      req.body = { ids: ["msg1", "msg2"] };
      mockMarcarComoLidas.mockResolvedValueOnce(undefined);

      await notificacoesController.marcarLidas(
        req as AuthRequest,
        res as Response,
      );
      expect(mockMarcarComoLidas).toHaveBeenCalledWith(["msg1", "msg2"]);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
