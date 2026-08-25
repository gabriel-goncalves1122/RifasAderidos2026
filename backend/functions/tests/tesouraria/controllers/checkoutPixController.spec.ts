import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResRifasController } from "../../rifas/helpers/criarReqResRifasController";

const mocks = {
  criarCheckoutPix: jest.fn<any>(),
  consultarCheckoutPix: jest.fn<any>(),
  processarWebhookCheckoutPix: jest.fn<any>(),
};

jest.mock("../../../src/modules/tesouraria/services/criarCheckoutPixService", () => ({
  CriarCheckoutPixService: {
    executar: mocks.criarCheckoutPix,
  },
}));

jest.mock("../../../src/modules/tesouraria/services/consultarCheckoutPixService", () => ({
  ConsultarCheckoutPixService: {
    executar: mocks.consultarCheckoutPix,
  },
}));

jest.mock("../../../src/modules/tesouraria/services/checkoutPixWebhookService", () => ({
  CheckoutPixWebhookService: {
    processarWebhook: mocks.processarWebhookCheckoutPix,
  },
}));

import { criarCheckoutPix } from "../../../src/modules/tesouraria/controllers/criarCheckoutPixController";
import { consultarCheckoutPix } from "../../../src/modules/tesouraria/controllers/consultarCheckoutPixController";
import { receberWebhookCheckoutPix } from "../../../src/modules/tesouraria/controllers/receberWebhookCheckoutPixController";

describe("Controllers Rifas: checkout Pix", () => {
  let req: Partial<AuthRequest> & { rawBody?: string };
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResRifasController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve criar cobrança Pix com sucesso", async () => {
    req.body = {
      nome: "Maria",
      telefone: "35999990000",
      numerosRifas: ["001"],
    };
    const cobranca = {
      id: "ORDE_001",
      status: "aguardando_pagamento",
      copiaECola: "000201PIX",
    };

    mocks.criarCheckoutPix.mockResolvedValueOnce(cobranca);

    await criarCheckoutPix(req as AuthRequest, res as Response);

    expect(mocks.criarCheckoutPix).toHaveBeenCalledWith(
      "user_123",
      "teste@teste.com",
      req.body,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(cobranca);
  });

  it("Deve retornar 400 em payload inválido", async () => {
    mocks.criarCheckoutPix.mockRejectedValueOnce(new Error("INVALID_DATA"));

    await criarCheckoutPix(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Dados incompletos para Pix.",
    });
  });

  it("Deve retornar 409 quando rifa não estiver disponível", async () => {
    mocks.criarCheckoutPix.mockRejectedValueOnce(
      new Error("RIFA_INDISPONIVEL"),
    );

    await criarCheckoutPix(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Uma ou mais rifas não estão disponíveis para venda.",
    });
  });

  it("Deve retornar 409 quando já houver pagamento em criação", async () => {
    mocks.criarCheckoutPix.mockRejectedValueOnce(
      new Error("PAGAMENTO_EM_CRIACAO"),
    );

    await criarCheckoutPix(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Já existe um pagamento em geração para essas rifas. Aguarde alguns segundos.",
    });
  });

  it("Deve consultar cobrança Pix do aderido", async () => {
    req.params = { id: "ORDE_001" } as any;
    const cobranca = {
      id: "ORDE_001",
      status: "pago",
      copiaECola: "000201PIX",
    };

    mocks.consultarCheckoutPix.mockResolvedValueOnce(cobranca);

    await consultarCheckoutPix(req as AuthRequest, res as Response);

    expect(mocks.consultarCheckoutPix).toHaveBeenCalledWith(
      "teste@teste.com",
      "ORDE_001",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(cobranca);
  });

  it("Deve processar webhook Pix com raw body e assinatura", async () => {
    req.body = { id: "ORDE_001" };
    req.rawBody = JSON.stringify(req.body);
    req.headers = { "x-authenticity-token": "assinatura" } as any;
    const resultado = { sucesso: true, status: "PAID" };

    mocks.processarWebhookCheckoutPix.mockResolvedValueOnce(resultado);

    await receberWebhookCheckoutPix(req as any, res as Response);

    expect(mocks.processarWebhookCheckoutPix).toHaveBeenCalledWith({
      payload: req.body,
      rawBody: req.rawBody,
      assinatura: "assinatura",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resultado);
  });

  it("Deve rejeitar webhook Pix com assinatura inválida", async () => {
    mocks.processarWebhookCheckoutPix.mockRejectedValueOnce(
      new Error("INVALID_SIGNATURE"),
    );

    await receberWebhookCheckoutPix(req as any, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Assinatura Pix inválida.",
    });
  });
});
