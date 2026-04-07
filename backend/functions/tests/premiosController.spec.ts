// ============================================================================
// ARQUIVO: tests/premiosController.spec.ts (Testes do Controller de Prêmios)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response } from "express";

const mockListarTodos = jest.fn<any>();
const mockSalvarInfoSorteio = jest.fn<any>();
const mockSalvarPremio = jest.fn<any>();
const mockExcluirPremio = jest.fn<any>();

jest.mock("../src/services/premiosService", () => ({
  PremiosService: {
    listarTodos: mockListarTodos,
    salvarInfoSorteio: mockSalvarInfoSorteio,
    salvarPremio: mockSalvarPremio,
    excluirPremio: mockExcluirPremio,
  },
}));

import { premiosController } from "../src/controllers/premiosController";

describe("Prêmios Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {} };
    res = { status: jest.fn<any>().mockReturnThis(), json: jest.fn<any>() };
  });

  it("obter() - Deve retornar 200 com prêmios", async () => {
    mockListarTodos.mockResolvedValueOnce({ premios: [] });
    await premiosController.obter(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("salvarSorteio() - Deve retornar 200", async () => {
    mockSalvarInfoSorteio.mockResolvedValueOnce(undefined);
    await premiosController.salvarSorteio(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("salvarPremio() - Deve retornar 200", async () => {
    mockSalvarPremio.mockResolvedValueOnce(undefined);
    await premiosController.salvarPremio(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("excluirPremio() - Deve retornar 200", async () => {
    req.params = { id: "premio_123" };
    mockExcluirPremio.mockResolvedValueOnce(undefined);

    await premiosController.excluirPremio(req as Request, res as Response);

    expect(mockExcluirPremio).toHaveBeenCalledWith("premio_123");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
