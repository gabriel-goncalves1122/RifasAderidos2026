// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/controllers/obterRelatorioTesourariaController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResRifasController } from "../helpers/criarReqResRifasController";

const mockObterRelatorioTesouraria = jest.fn<any>();

jest.mock("../../../src/modules/rifas/rifasService", () => ({
  RifasService: {
    obterRelatorioTesouraria: mockObterRelatorioTesouraria,
  },
}));

import { obterRelatorioTesouraria } from "../../../src/modules/rifas/controllers/obterRelatorioTesourariaController";

describe("Controller: obterRelatorioTesouraria", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResRifasController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve retornar 200 com o relatório da tesouraria", async () => {
    const relatorio = {
      resumoGeral: {
        totalArrecadado: 100,
      },
      aderidos: [],
    };

    mockObterRelatorioTesouraria.mockResolvedValueOnce(relatorio);

    await obterRelatorioTesouraria(req as AuthRequest, res as Response);

    expect(mockObterRelatorioTesouraria).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(relatorio);
  });

  it("Deve retornar 500 se ocorrer erro ao gerar relatório", async () => {
    mockObterRelatorioTesouraria.mockRejectedValueOnce(
      new Error("Falha inesperada"),
    );

    await obterRelatorioTesouraria(req as AuthRequest, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao gerar relatório.",
    });
  });
});
