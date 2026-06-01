// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/controllers/getMinhasRifasController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResRifasController } from "../helpers/criarReqResRifasController";

const mockBuscarPorAderido = jest.fn<any>();

jest.mock("../../../src/modules/rifas/rifasService", () => ({
  RifasService: {
    buscarPorAderido: mockBuscarPorAderido,
  },
}));

import { getMinhasRifas } from "../../../src/modules/rifas/controllers/getMinhasRifasController";

describe("Controller: getMinhasRifas", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResRifasController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve retornar 401 se o usuário não estiver autenticado", async () => {
    req.user = undefined;

    await getMinhasRifas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuário não autenticado.",
    });
  });

  it("Deve retornar 404 se o usuário não for aderido oficial", async () => {
    mockBuscarPorAderido.mockRejectedValueOnce(new Error("USER_NOT_FOUND"));

    await getMinhasRifas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Você não está na lista de aderidos oficiais.",
    });
  });

  it("Deve retornar 200 com os bilhetes em caso de sucesso", async () => {
    mockBuscarPorAderido.mockResolvedValueOnce([{ numero: "001" }]);

    await getMinhasRifas(req as AuthRequest, res as Response);

    expect(mockBuscarPorAderido).toHaveBeenCalledWith("teste@teste.com");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      bilhetes: [{ numero: "001" }],
    });
  });

  it("Deve retornar 500 se ocorrer erro inesperado", async () => {
    mockBuscarPorAderido.mockRejectedValueOnce(new Error("Falha inesperada"));

    await getMinhasRifas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro interno ao buscar rifas.",
    });
  });
});
