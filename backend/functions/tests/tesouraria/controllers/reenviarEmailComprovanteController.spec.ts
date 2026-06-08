import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResTesourariaController } from "../helpers/criarReqResTesourariaController";

const mockReenviarEmailComprovante = jest.fn<any>();

jest.mock("../../../src/modules/tesouraria/tesourariaService", () => ({
  TesourariaService: {
    reenviarEmailComprovante: mockReenviarEmailComprovante,
  },
}));

import { reenviarEmailComprovante } from "../../../src/modules/tesouraria/controllers/reenviarEmailComprovanteController";

describe("Controller Tesouraria: reenviarEmailComprovante", () => {
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
    };
    res = contexto.res;
  });

  it("Deve reenviar e-mail de comprovante", async () => {
    const envio = {
      comprador_id: "comprador_123",
      email: "maria@teste.com",
      rifas: ["001", "002"],
      status: "aprovado",
    };

    mockReenviarEmailComprovante.mockResolvedValueOnce(envio);

    await reenviarEmailComprovante(req as AuthRequest, res as Response);

    expect(mockReenviarEmailComprovante).toHaveBeenCalledWith("comprador_123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "E-mail de comprovante reenviado.",
      envio,
    });
  });

  it("Deve retornar 400 quando compradorId não for informado", async () => {
    req.params = {
      compradorId: "   ",
    };

    await reenviarEmailComprovante(req as AuthRequest, res as Response);

    expect(mockReenviarEmailComprovante).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "compradorId é obrigatório.",
    });
  });

  it("Deve retornar 404 quando compra não for encontrada", async () => {
    mockReenviarEmailComprovante.mockRejectedValueOnce(
      new Error("COMPRA_NAO_ENCONTRADA"),
    );

    await reenviarEmailComprovante(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Compra não encontrada para o comprador informado.",
    });
  });

  it("Deve retornar 409 quando compra não estiver paga", async () => {
    mockReenviarEmailComprovante.mockRejectedValueOnce(
      new Error("COMPRA_NAO_PAGA"),
    );

    await reenviarEmailComprovante(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "O e-mail de comprovante só pode ser reenviado para compras pagas.",
    });
  });

  it("Deve retornar 422 quando compra não tiver e-mail", async () => {
    mockReenviarEmailComprovante.mockRejectedValueOnce(
      new Error("COMPRA_SEM_EMAIL"),
    );

    await reenviarEmailComprovante(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: "A compra não possui e-mail do comprador.",
    });
  });

  it("Deve retornar 500 quando service falhar", async () => {
    mockReenviarEmailComprovante.mockRejectedValueOnce(
      new Error("EMAIL_COMPROVANTE_NAO_ENVIADO"),
    );

    await reenviarEmailComprovante(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao reenviar e-mail de comprovante.",
    });
  });
});
