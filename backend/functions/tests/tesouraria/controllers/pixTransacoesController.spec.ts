// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/controllers/pixTransacoesController.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Response } from "express";

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResTesourariaController } from "../helpers/criarReqResTesourariaController";

const mocks = {
  buscarPixTransacoes: jest.fn<any>(),
  obterPixTransacoesResumo: jest.fn<any>(),
  sincronizarPixTransacoes: jest.fn<any>(),
};

jest.mock("../../../src/modules/tesouraria/tesourariaService", () => ({
  TesourariaService: {
    buscarPixTransacoes: mocks.buscarPixTransacoes,
    obterPixTransacoesResumo: mocks.obterPixTransacoesResumo,
    sincronizarPixTransacoes: mocks.sincronizarPixTransacoes,
  },
}));

import { listarPixTransacoes } from "../../../src/modules/tesouraria/controllers/listarPixTransacoesController";
import { obterPixTransacoesResumo } from "../../../src/modules/tesouraria/controllers/obterPixTransacoesResumoController";
import { sincronizarPixTransacoes } from "../../../src/modules/tesouraria/controllers/sincronizarPixTransacoesController";

describe("Controllers Tesouraria: Pix transações", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResTesourariaController();
    req = contexto.req;
    res = contexto.res;
  });

  it("Deve listar transações Pix normalizadas", async () => {
    const transacoes = [{ id: "tx_001", statusPagamento: "PAID" }];

    mocks.buscarPixTransacoes.mockResolvedValueOnce(transacoes);

    await listarPixTransacoes(req as AuthRequest, res as Response);

    expect(mocks.buscarPixTransacoes).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ transacoes });
  });

  it("Deve retornar resumo das transações Pix", async () => {
    const resumo = {
      totalRecebido: 100,
      totalPendente: 20,
      totalCancelado: 0,
      totalDivergente: 0,
      quantidadePagas: 1,
      quantidadeAguardando: 1,
      quantidadeCanceladas: 0,
      quantidadeNaoIdentificadas: 0,
      ticketMedio: 100,
    };

    mocks.obterPixTransacoesResumo.mockResolvedValueOnce(resumo);

    await obterPixTransacoesResumo(req as AuthRequest, res as Response);

    expect(mocks.obterPixTransacoesResumo).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ resumo });
  });

  it("Deve executar sincronização compatível sem integração externa", async () => {
    const resultado = {
      sucesso: true,
      sincronizado: false,
      mensagem: "Dados locais preservados.",
    };

    mocks.sincronizarPixTransacoes.mockResolvedValueOnce(resultado);

    await sincronizarPixTransacoes(req as AuthRequest, res as Response);

    expect(mocks.sincronizarPixTransacoes).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(resultado);
  });
});
