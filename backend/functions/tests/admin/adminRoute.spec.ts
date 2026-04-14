import request from "supertest";
import express from "express";
import adminRoutes from "../../src/modules/admin/adminRoutes";
import { jest, describe, beforeAll, it, expect } from "@jest/globals";

// 1. MOCK DOS CONTROLLERS (Para não rodar a lógica real)
jest.mock("../../src/modules/admin/compacController", () => ({
  compacController: {
    compactarArquivos: (req: any, res: any) =>
      res.status(200).json({ mock: "compactar" }),
  },
}));

jest.mock("../../src/modules/admin/adminController", () => ({
  adminController: {
    adicionarAderido: (req: any, res: any) =>
      res.status(201).json({ mock: "aderido" }),
  },
}));

// 2. MOCK DO MIDDLEWARE DE AUTENTICAÇÃO
jest.mock("../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (req: any, res: any, next: any) => next(), // Deixa passar direto
  requireTesourariaOrAdmin: (req: any, res: any, next: any) => next(), // ADICIONE ESTA LINHA
}));

describe("Rotas: /admin", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    // Injetamos a rota no nosso app de teste
    app.use("/admin", adminRoutes);
  });

  it("POST /admin/compactar -> deve chamar o compacController", async () => {
    const response = await request(app).post("/admin/compactar");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mock: "compactar" });
  });

  it("POST /admin/aderidos -> deve chamar o adminController", async () => {
    const response = await request(app).post("/admin/aderidos");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ mock: "aderido" });
  });

  it("GET /admin/compactar -> deve retornar 404 (Método incorreto)", async () => {
    const response = await request(app).get("/admin/compactar");
    expect(response.status).toBe(404);
  });
});
