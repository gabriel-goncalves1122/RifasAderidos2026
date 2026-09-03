// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/controllers/obterHistoricoDetalhadoController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResRifasController } from "../helpers/criarReqResRifasController";

const mockObterHistoricoDetalhado = jest.fn<any>();

jest.mock("../../../src/modules/rifas/rifasService", () => ({
  RifasService: {
    obterHistoricoDetalhado: mockObterHistoricoDetalhado,
  },
}));

import { obterHistoricoDetalhado } from "../../../src/modules/rifas/controllers/obterHistoricoDetalhadoController";

describe("Controller: obterHistoricoDetalhado", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResRifasController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve retornar 200 com o histórico detalhado", async () => {
    mockObterHistoricoDetalhado.mockResolvedValueOnce([{ status: "pago" }]);

    await obterHistoricoDetalhado(req as AuthRequest, res as Response);

    expect(mockObterHistoricoDetalhado).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      historico: [{ status: "pago" }],
    });
  });

  it("Deve retornar 500 se ocorrer erro ao buscar histórico", async () => {
    mockObterHistoricoDetalhado.mockRejectedValueOnce(
      new Error("Falha inesperada"),
    );

    await obterHistoricoDetalhado(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao buscar o histórico de vendas.",
    });
  });
});
