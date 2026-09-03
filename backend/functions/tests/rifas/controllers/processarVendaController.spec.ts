// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/controllers/processarVendaController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResRifasController } from "../helpers/criarReqResRifasController";

const mockProcessarVenda = jest.fn<any>();

jest.mock("../../../src/modules/rifas/rifasService", () => ({
  RifasService: {
    processarVenda: mockProcessarVenda,
  },
}));

import { processarVenda } from "../../../src/modules/rifas/controllers/processarVendaController";

describe("Controller: processarVenda", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResRifasController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve retornar 401 se faltar UID ou e-mail", async () => {
    req.user = { uid: "user_123" } as any;

    await processarVenda(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Não autorizado.",
    });
  });

  it("Deve retornar 400 se os dados forem inválidos", async () => {
    mockProcessarVenda.mockRejectedValueOnce(new Error("INVALID_DATA"));

    await processarVenda(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Dados incompletos ou comprovante faltando.",
    });
  });

  it("Deve retornar 404 se o usuário não for aderido oficial", async () => {
    mockProcessarVenda.mockRejectedValueOnce(new Error("USER_NOT_FOUND"));

    await processarVenda(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Você não está na lista de aderidos oficiais.",
    });
  });

  it("Deve retornar 200 ao processar venda com sucesso", async () => {
    req.body = {
      numerosRifas: ["001"],
      comprovanteUrl: "https://storage.mock/comprovante.png",
    };

    mockProcessarVenda.mockResolvedValueOnce(undefined);

    await processarVenda(req as AuthRequest, res as Response);

    expect(mockProcessarVenda).toHaveBeenCalledWith(
      "user_123",
      "teste@teste.com",
      req.body,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Venda registrada com sucesso! Comprovante em análise.",
    });
  });

  it("Deve retornar 500 se ocorrer erro inesperado", async () => {
    mockProcessarVenda.mockRejectedValueOnce(new Error("Falha inesperada"));

    await processarVenda(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao processar a venda.",
    });
  });
});
