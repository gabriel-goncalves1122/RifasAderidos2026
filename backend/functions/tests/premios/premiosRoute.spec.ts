import request from "supertest";
import express from "express";
import premiosRoutes from "../../src/modules/premios/premiosRoutes";
import { jest, describe, beforeAll, it, expect } from "@jest/globals";

jest.mock("../../src/modules/premios/premiosController", () => ({
  premiosController: {
    obter: (req: any, res: any) => res.status(200).json({ acao: "obter" }),
    salvarPremio: (req: any, res: any) =>
      res.status(201).json({ acao: "salvar" }),
    salvarSorteio: (req: any, res: any) =>
      res.status(200).json({ acao: "sortear" }),
    excluirPremio: (req: any, res: any) =>
      res.status(200).json({ acao: "excluir", id: req.params.id }),
  },
}));

jest.mock("../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (req: any, res: any, next: any) => next(),
}));

describe("Rotas: /premios", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/premios", premiosRoutes);
  });

  it("GET /premios -> deve listar prêmios (Pública)", async () => {
    const response = await request(app).get("/premios");
    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("obter");
  });

  it("POST /premios -> deve salvar um prêmio", async () => {
    const response = await request(app).post("/premios");
    expect(response.status).toBe(201);
    expect(response.body.acao).toBe("salvar");
  });

  it("PUT /premios/sorteio -> deve salvar sorteio", async () => {
    const response = await request(app).put("/premios/sorteio");
    expect(response.status).toBe(200);
  });

  it("DELETE /premios/:id -> deve excluir prêmio e extrair o ID da URL", async () => {
    const response = await request(app).delete("/premios/12345");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("12345"); // Garante que a rota capturou o parâmetro
  });
});
