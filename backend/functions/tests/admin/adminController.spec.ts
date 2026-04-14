import { adminController } from "../../src/modules/admin/adminController";
import { adminService } from "../../src/modules/admin/adminService";
import { Request, Response } from "express";
import {
  jest,
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from "@jest/globals";

// Fazemos mock do Service para isolar o Controller
jest.mock("../../src/modules/admin/adminService", () => ({
  adminService: {
    adicionarAderido: jest.fn(),
  },
}));

describe("Controller: adminController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let consoleErrorSpy: any;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("Deve retornar erro 400 se o e-mail não for enviado", async () => {
    mockReq = { body: { nome: "João" } }; // Sem email

    await adminController.adicionarAderido(
      mockReq as Request,
      mockRes as Response,
    );

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "O e-mail é obrigatório.",
    });
    expect(adminService.adicionarAderido).not.toHaveBeenCalled();
  });

  it("Deve retornar 201 e o sucesso se o Service funcionar perfeitamente", async () => {
    mockReq = { body: { email: "joao@teste.com", nome: "João" } };
    const mockResultadoService = {
      idAderido: "ADERIDO_001",
      bilhetesGerados: 120,
    };

    // Usamos jest.mocked para que o TS reconheça o mockResolvedValue
    jest
      .mocked(adminService.adicionarAderido)
      .mockResolvedValue(mockResultadoService);

    await adminController.adicionarAderido(
      mockReq as Request,
      mockRes as Response,
    );

    expect(adminService.adicionarAderido).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Aderido e bilhetes gerados com sucesso!",
      idAderido: "ADERIDO_001",
      bilhetesGerados: 120,
    });
  });

  it("Deve capturar erros atirados pelo Service e retornar 400", async () => {
    mockReq = { body: { email: "duplicado@teste.com" } };
    const erroSimulado = new Error(
      "Este e-mail já foi autorizado anteriormente.",
    );

    jest.mocked(adminService.adicionarAderido).mockRejectedValue(erroSimulado);

    await adminController.adicionarAderido(
      mockReq as Request,
      mockRes as Response,
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Este e-mail já foi autorizado anteriormente.",
    });
  });
});
