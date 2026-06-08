// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/controllers/atualizarCompradorCompraController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResTesourariaController } from "../helpers/criarReqResTesourariaController";

const mockAtualizarCompradorCompra = jest.fn<any>();

jest.mock("../../../src/modules/tesouraria/tesourariaService", () => ({
  TesourariaService: {
    atualizarCompradorCompra: mockAtualizarCompradorCompra,
  },
}));

import { atualizarCompradorCompra } from "../../../src/modules/tesouraria/controllers/atualizarCompradorCompraController";

describe("Controller Tesouraria: atualizarCompradorCompra", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResTesourariaController();
    req = {
      ...contexto.req,
      params: {
        compradorId: "comprador_123",
      },
      body: {
        nome: "Maria Atualizada",
        email: "maria@teste.com",
        telefone: "35999990000",
      },
    };
    res = contexto.res;
  });

  it("Deve atualizar comprador da compra com payload normalizado", async () => {
    const compra = {
      comprador_id: "comprador_123",
      nome: "Maria Atualizada",
      email: "maria@teste.com",
      telefone: "35999990000",
    };

    mockAtualizarCompradorCompra.mockResolvedValueOnce(compra);

    await atualizarCompradorCompra(req as AuthRequest, res as Response);

    expect(mockAtualizarCompradorCompra).toHaveBeenCalledWith(
      "comprador_123",
      {
        nome: "Maria Atualizada",
        email: "maria@teste.com",
        telefone: "35999990000",
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      compra,
    });
  });

  it("Deve retornar 400 quando nome não for informado", async () => {
    req.body = {
      nome: "   ",
    };

    await atualizarCompradorCompra(req as AuthRequest, res as Response);

    expect(mockAtualizarCompradorCompra).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Nome do comprador é obrigatório.",
    });
  });

  it("Deve retornar 404 quando a compra não for encontrada", async () => {
    mockAtualizarCompradorCompra.mockRejectedValueOnce(
      new Error("COMPRA_NAO_ENCONTRADA"),
    );

    await atualizarCompradorCompra(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Compra não encontrada para o comprador informado.",
    });
  });

  it("Deve retornar 500 quando o service falhar", async () => {
    mockAtualizarCompradorCompra.mockRejectedValueOnce(
      new Error("Falha inesperada"),
    );

    await atualizarCompradorCompra(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao atualizar dados do comprador.",
    });
  });
});
