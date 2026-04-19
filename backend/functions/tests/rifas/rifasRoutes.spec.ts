// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/rifasRoutes.spec.ts
// ============================================================================
import request from "supertest";
import express from "express";
import rifasRoutes from "../../src/modules/rifas/rifasRoutes";
import { jest, describe, beforeAll, it, expect } from "@jest/globals";

// Mock do Controller das Rifas
jest.mock("../../src/modules/rifas/rifasController", () => ({
  rifasController: {
    processarVenda: (req: any, res: any) =>
      res.status(201).json({ acao: "processar_venda" }),
    getMinhasRifas: (req: any, res: any) =>
      res.status(200).json({ acao: "minhas_rifas" }),
    obterRelatorioTesouraria: (req: any, res: any) =>
      res.status(200).json({ acao: "relatorio_tesouraria" }),
    obterHistoricoDetalhado: (req: any, res: any) =>
      res.status(200).json({ acao: "historico_detalhado" }),
    // ==========================================================
    // A NOVA FUNÇÃO MOCKADA AQUI:
    // ==========================================================
    corrigirRecusadas: (req: any, res: any) =>
      res.status(200).json({ acao: "corrigir_recusadas" }),
  },
}));

jest.mock("../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (req: any, res: any, next: any) => next(),
}));

describe("Rotas: /rifas", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/rifas", rifasRoutes);
  });

  it("POST /rifas/vender -> deve chamar processarVenda", async () => {
    const response = await request(app).post("/rifas/vender");
    expect(response.status).toBe(201);
    expect(response.body.acao).toBe("processar_venda");
  });

  it("GET /rifas/minhas-rifas -> deve chamar getMinhasRifas", async () => {
    const response = await request(app).get("/rifas/minhas-rifas");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("minhas_rifas");
  });

  it("GET /rifas/relatorio -> deve chamar obterRelatorioTesouraria", async () => {
    const response = await request(app).get("/rifas/relatorio");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("relatorio_tesouraria");
  });

  it("GET /rifas/historico -> deve chamar obterHistoricoDetalhado", async () => {
    const response = await request(app).get("/rifas/historico");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("historico_detalhado");
  });

  // ==========================================================
  // O NOVO TESTE DE ROTA AQUI:
  // ==========================================================
  it("POST /rifas/corrigir -> deve chamar corrigirRecusadas", async () => {
    const response = await request(app).post("/rifas/corrigir");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("corrigir_recusadas");
  });
});
