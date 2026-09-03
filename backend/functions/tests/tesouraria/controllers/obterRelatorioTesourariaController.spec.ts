// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/controllers/obterRelatorioTesourariaController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResTesourariaController } from "../helpers/criarReqResTesourariaController";

const mockObterRelatorioTesouraria = jest.fn<any>();

jest.mock("../../../src/modules/tesouraria/tesourariaService", () => ({
  TesourariaService: {
    obterRelatorioTesouraria: mockObterRelatorioTesouraria,
  },
}));

import { obterRelatorioTesouraria } from "../../../src/modules/tesouraria/controllers/obterRelatorioTesourariaController";

describe("Controller Tesouraria: obterRelatorioTesouraria", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResTesourariaController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve retornar 200 com o relatório financeiro", async () => {
    const relatorio = {
      resumoGeral: { totalArrecadado: 100, rifasPagas: 10 },
      aderidos: [],
    };

    mockObterRelatorioTesouraria.mockResolvedValueOnce(relatorio);

    await obterRelatorioTesouraria(req as AuthRequest, res as Response);

    expect(mockObterRelatorioTesouraria).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(relatorio);
  });

  it("Deve retornar 500 quando o service falhar", async () => {
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
