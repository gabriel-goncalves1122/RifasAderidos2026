// ============================================================================
// ARQUIVO: tests/auditoriaController.spec.ts (Testes do Controller de Auditoria)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Response } from "express";
import { AuthRequest } from "../../src/shared/middlewares/authMiddleware";

const mockListarPendentes = jest.fn<any>();
const mockAuditarLoteIA = jest.fn<any>();
const mockProcessarDecisaoManual = jest.fn<any>();
const mockSalvarExtratoCsv = jest.fn<any>();

jest.mock("../../src/modules/auditoria/auditoriaService", () => ({
  AuditoriaService: {
    listarPendentes: mockListarPendentes,
    auditarLoteIA: mockAuditarLoteIA,
    processarDecisaoManual: mockProcessarDecisaoManual,
    salvarExtratoCsv: mockSalvarExtratoCsv,
  },
}));

import { auditoriaController } from "../../src/modules/auditoria/auditoriaController";

describe("Auditoria Controller", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    req = { body: {} };
    res = {
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };
  });

  describe("listarPendentes()", () => {
    it("Deve retornar 200 com a lista de bilhetes", async () => {
      mockListarPendentes.mockResolvedValueOnce([{ numero: "001" }]);
      await auditoriaController.listarPendentes(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ bilhetes: [{ numero: "001" }] });
    });
  });

  describe("auditarIA()", () => {
    it("Deve retornar 200 com o resultado da IA", async () => {
      mockAuditarLoteIA.mockResolvedValueOnce({
        preAprovados: 10,
        divergentes: 2,
      });
      await auditoriaController.auditarIA(req as AuthRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          sucesso: true,
          dados: { preAprovados: 10, divergentes: 2 },
        }),
      );
    });
  });

  describe("avaliarManual()", () => {
    it("Deve retornar 400 se os parâmetros forem inválidos", async () => {
      req.body = { numerosRifas: "não sou um array", decisao: "aprovar" };
      await auditoriaController.avaliarManual(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockProcessarDecisaoManual).not.toHaveBeenCalled();
    });

    it("Deve processar a decisão manual e retornar 200", async () => {
      req.body = {
        numerosRifas: ["001"],
        decisao: "rejeitar",
        motivo: "Falso",
      };
      mockProcessarDecisaoManual.mockResolvedValueOnce(undefined);

      await auditoriaController.avaliarManual(
        req as AuthRequest,
        res as Response,
      );

      expect(mockProcessarDecisaoManual).toHaveBeenCalledWith(
        ["001"],
        "rejeitar",
        "Falso",
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("salvarExtrato()", () => {
    it("Deve retornar 400 se o extrato CSV não for enviado", async () => {
      req.body = {}; // Corpo vazio, sem extratoCsv

      await auditoriaController.salvarExtrato(
        req as AuthRequest,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Extrato não enviado.",
      });
      expect(mockSalvarExtratoCsv).not.toHaveBeenCalled();
    });

    it("Deve repassar o extrato para o Service e retornar 200 em caso de sucesso", async () => {
      req.body = { extratoCsv: "linha1,linha2" };
      mockSalvarExtratoCsv.mockResolvedValueOnce(undefined);

      await auditoriaController.salvarExtrato(
        req as AuthRequest,
        res as Response,
      );

      expect(mockSalvarExtratoCsv).toHaveBeenCalledWith("linha1,linha2");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ sucesso: true });
    });

    it("Deve retornar 500 se o Service atirar um erro", async () => {
      req.body = { extratoCsv: "linha1,linha2" };
      const erroSimulado = new Error("Erro no Firebase");
      mockSalvarExtratoCsv.mockRejectedValueOnce(erroSimulado);

      await auditoriaController.salvarExtrato(
        req as AuthRequest,
        res as Response,
      );

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro interno ao salvar o extrato.",
      });
    });
  });
});
