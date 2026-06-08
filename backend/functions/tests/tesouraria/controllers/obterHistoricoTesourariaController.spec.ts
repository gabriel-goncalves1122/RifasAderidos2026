// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/controllers/obterHistoricoTesourariaController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResTesourariaController } from "../helpers/criarReqResTesourariaController";

const mockObterHistoricoDetalhado = jest.fn<any>();

jest.mock("../../../src/modules/tesouraria/tesourariaService", () => ({
  TesourariaService: {
    obterHistoricoDetalhado: mockObterHistoricoDetalhado,
  },
}));

import { obterHistoricoTesouraria } from "../../../src/modules/tesouraria/controllers/obterHistoricoTesourariaController";

describe("Controller Tesouraria: obterHistoricoTesouraria", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResTesourariaController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve retornar 200 com o histórico detalhado", async () => {
    const historico = [{ numero_rifa: "001", status: "pago" }];

    mockObterHistoricoDetalhado.mockResolvedValueOnce(historico);

    await obterHistoricoTesouraria(req as AuthRequest, res as Response);

    expect(mockObterHistoricoDetalhado).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ historico });
  });

  it("Deve retornar 500 quando o service falhar", async () => {
    mockObterHistoricoDetalhado.mockRejectedValueOnce(
      new Error("Falha inesperada"),
    );

    await obterHistoricoTesouraria(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao buscar o histórico de vendas.",
    });
  });
});
