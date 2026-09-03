import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResRifasController } from "../helpers/criarReqResRifasController";

const mockCorrigirDadosRifasRecusadas = jest.fn<any>();

jest.mock("../../../src/modules/rifas/rifasService", () => ({
  RifasService: {
    corrigirDadosRifasRecusadas: mockCorrigirDadosRifasRecusadas,
  },
}));

import { corrigirDadosRifas } from "../../../src/modules/rifas/controllers/corrigirDadosRifasController";

describe("Controller: corrigirDadosRifas", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResRifasController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve corrigir dados de rifas recusadas", async () => {
    req.body = {
      numerosRifas: ["001"],
      nome: "Maria",
      telefone: "35999990000",
      email: "maria@teste.com",
    };

    mockCorrigirDadosRifasRecusadas.mockResolvedValueOnce(true);

    await corrigirDadosRifas(req as AuthRequest, res as Response);

    expect(mockCorrigirDadosRifasRecusadas).toHaveBeenCalledWith(
      "teste@teste.com",
      ["001"],
      {
        nome: "Maria",
        telefone: "35999990000",
        email: "maria@teste.com",
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Dados corrigidos e reenviados para validação.",
    });
  });

  it("Deve retornar 400 para dados incompletos", async () => {
    mockCorrigirDadosRifasRecusadas.mockRejectedValueOnce(
      new Error("INVALID_DATA"),
    );

    await corrigirDadosRifas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Dados incompletos para correção.",
    });
  });

  it("Deve retornar 404 quando não houver rifa recusada válida", async () => {
    mockCorrigirDadosRifasRecusadas.mockRejectedValueOnce(
      new Error("RIFAS_NOT_FOUND"),
    );

    await corrigirDadosRifas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Nenhuma rifa recusada foi encontrada.",
    });
  });
});
