import request from "supertest";
import express from "express";
// Ajuste o caminho de importação consoante a sua estrutura de pastas
import auditoriaRoutes from "../../src/modules/auditoria/auditoriaRoutes";
import { jest, describe, beforeAll, it, expect } from "@jest/globals";

// 1. MOCK DO CONTROLLER
jest.mock("../../src/modules/auditoria/auditoriaController", () => ({
  auditoriaController: {
    listarPendentes: (req: any, res: any) =>
      res.status(200).json({ acao: "listar_pendentes" }),
    avaliarManual: (req: any, res: any) =>
      res.status(200).json({ acao: "avaliar_manual" }),
    auditarIA: (req: any, res: any) =>
      res.status(200).json({ acao: "auditar_ia" }),
  },
}));

// 2. MOCK DO MIDDLEWARE
jest.mock("../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (req: any, res: any, next: any) => next(), // Deixa passar
  requireTesourariaOrAdmin: (req: any, res: any, next: any) => next(), // ADICIONE ESTA LINHA
}));

describe("Rotas: /auditoria", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/auditoria", auditoriaRoutes);
  });

  it("GET /auditoria/pendentes -> deve chamar listarPendentes", async () => {
    const response = await request(app).get("/auditoria/pendentes");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("listar_pendentes");
  });

  it("POST /auditoria/avaliar -> deve chamar avaliarManual", async () => {
    const response = await request(app).post("/auditoria/avaliar");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("avaliar_manual");
  });

  it("POST /auditoria/auditar-lote -> deve chamar auditarIA", async () => {
    const response = await request(app).post("/auditoria/auditar-lote");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("auditar_ia");
  });
});
