// ============================================================================
// ARQUIVO: backend/functions/tests/admin/compac/compacRoutes.spec.ts
// ============================================================================
import request from "supertest";
import express from "express";
import { jest, describe, beforeAll, it, expect } from "@jest/globals";

import compacRoutes from "../../../src/modules/admin/compac/compacRoutes";

jest.mock("../../../src/modules/admin/compac/compacController", () => ({
  compacController: {
    compactarArquivos: (_req: any, res: any) =>
      res.status(200).json({ mock: "compactar" }),
  },
}));

jest.mock("../../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (_req: any, _res: any, next: any) => next(),
  requireTesourariaOrAdmin: (_req: any, _res: any, next: any) => next(),
}));

describe("Rotas: admin/compac", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/admin", compacRoutes);
  });

  it("POST /admin/compactar deve chamar compacController.compactarArquivos", async () => {
    const response = await request(app).post("/admin/compactar");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mock: "compactar" });
  });

  it("GET /admin/compactar deve retornar 404 por método incorreto", async () => {
    const response = await request(app).get("/admin/compactar");

    expect(response.status).toBe(404);
  });
});
