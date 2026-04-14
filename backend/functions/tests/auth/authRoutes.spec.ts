import request from "supertest";
import express from "express";
import authRoutes from "../../src/modules/auth/authRoutes";
import { jest, describe, beforeAll, it, expect } from "@jest/globals";

jest.mock("../../src/modules/auth/authController", () => ({
  authController: {
    verificarElegibilidade: (req: any, res: any) =>
      res.status(200).json({ status: "publico" }),
    completarRegisto: (req: any, res: any) =>
      res.status(201).json({ status: "privado" }),
  },
}));

// Simulamos que o token falha se passarmos um header específico (só para testar a proteção)
jest.mock("../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (req: any, res: any, next: any) => {
    if (req.headers.authorization === "Bearer INVALIDO") {
      return res.status(401).json({ error: "Não autorizado" });
    }
    next();
  },
}));

describe("Rotas: /auth", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/auth", authRoutes);
  });

  it("POST /auth/elegibilidade -> Rota PÚBLICA deve passar direto", async () => {
    const response = await request(app).post("/auth/elegibilidade");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "publico" });
  });

  it("POST /auth/completar-registo -> Rota PRIVADA deve passar com token válido", async () => {
    const response = await request(app)
      .post("/auth/completar-registo")
      .set("Authorization", "Bearer VALIDO"); // Middleware deixa passar

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ status: "privado" });
  });

  it("POST /auth/completar-registo -> Rota PRIVADA deve bloquear sem token/token inválido", async () => {
    const response = await request(app)
      .post("/auth/completar-registo")
      .set("Authorization", "Bearer INVALIDO"); // Middleware bloqueia

    expect(response.status).toBe(401);
  });
});
