import request from "supertest";
import express from "express";
import notificacoesRoutes from "../../src/modules/notificacoes/notificacoesRoutes";
import { jest, describe, beforeAll, it, expect } from "@jest/globals";

jest.mock("../../src/modules/notificacoes/notificacoesController", () => ({
  notificacoesController: {
    obter: (req: any, res: any) =>
      res.status(200).json({ acao: "obter_notificacoes" }),
    marcarLidas: (req: any, res: any) =>
      res.status(200).json({ acao: "marcar_lidas" }),
  },
}));

jest.mock("../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (req: any, res: any, next: any) => next(),
}));

describe("Rotas: /notificacoes", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/notificacoes", notificacoesRoutes);
  });

  it("GET /notificacoes/ -> deve chamar obter", async () => {
    const response = await request(app).get("/notificacoes/");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("obter_notificacoes");
  });

  it("PUT /notificacoes/ler -> deve chamar marcarLidas", async () => {
    const response = await request(app).put("/notificacoes/ler");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("marcar_lidas");
  });
});
