// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/controllers/corrigirRecusadasController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResRifasController } from "../helpers/criarReqResRifasController";

const mockCorrigirRifasRecusadas = jest.fn<any>();

jest.mock("../../../src/modules/rifas/rifasService", () => ({
  RifasService: {
    corrigirRifasRecusadas: mockCorrigirRifasRecusadas,
  },
}));

import { corrigirRecusadas } from "../../../src/modules/rifas/controllers/corrigirRecusadasController";

describe("Controller: corrigirRecusadas", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResRifasController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve retornar 401 se o usuário não tiver e-mail no token", async () => {
    req.user = { uid: "user_123" } as any;

    await corrigirRecusadas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Utilizador não autenticado.",
    });
  });

  it("Deve retornar 400 se faltarem dados obrigatórios", async () => {
    req.body = {
      numerosRifas: [],
    };

    await corrigirRecusadas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Dados incompletos para correção.",
    });
  });

  it("Deve retornar 404 se o usuário não for aderido oficial", async () => {
    req.body = {
      numerosRifas: ["010"],
      comprovanteUrl: "https://storage.mock/comprovante.png",
    };

    mockCorrigirRifasRecusadas.mockRejectedValueOnce(
      new Error("USER_NOT_FOUND"),
    );

    await corrigirRecusadas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Você não está na lista de aderidos oficiais.",
    });
  });

  it("Deve chamar o serviço de correção e retornar 200 em caso de sucesso", async () => {
    req.body = {
      numerosRifas: ["010"],
      nome: "Novo Nome",
      telefone: "11999999999",
      email: "novo@teste.com",
      comprovanteUrl: "https://minha-url.com/novo.pdf",
    };

    mockCorrigirRifasRecusadas.mockResolvedValueOnce(true);

    await corrigirRecusadas(req as AuthRequest, res as Response);

    expect(mockCorrigirRifasRecusadas).toHaveBeenCalledWith(
      "teste@teste.com",
      ["010"],
      {
        nome: "Novo Nome",
        telefone: "11999999999",
        email: "novo@teste.com",
        comprovanteUrl: "https://minha-url.com/novo.pdf",
      },
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Rifas reenviadas para análise com sucesso!",
    });
  });

  it("Deve retornar 400 se o serviço lançar INVALID_DATA", async () => {
    req.body = {
      numerosRifas: ["010"],
      comprovanteUrl: "https://minha-url.com",
    };

    mockCorrigirRifasRecusadas.mockRejectedValueOnce(
      new Error("INVALID_DATA"),
    );

    await corrigirRecusadas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Dados incompletos para correção.",
    });
  });

  it("Deve capturar erros do serviço e retornar 500", async () => {
    req.body = {
      numerosRifas: ["010"],
      comprovanteUrl: "https://minha-url.com",
    };

    mockCorrigirRifasRecusadas.mockRejectedValueOnce(
      new Error("Falha no Banco"),
    );

    await corrigirRecusadas(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro interno ao processar correção.",
    });
  });
});
