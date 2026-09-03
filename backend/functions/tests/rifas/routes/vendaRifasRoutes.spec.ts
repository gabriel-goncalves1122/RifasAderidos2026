// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/routes/vendaRifasRoutes.spec.ts
// ============================================================================
import request from "supertest";
import { describe, expect, it, jest } from "@jest/globals";

import vendaRifasRoutes from "../../../src/modules/rifas/routes/vendaRifasRoutes";
import { criarAppRifasTeste } from "../helpers/criarAppRifasTeste";

jest.mock("../../../src/modules/rifas/rifasController", () => ({
  rifasController: {
    processarVenda: (_req: any, res: any) =>
      res.status(201).json({ acao: "processar_venda" }),
  },
}));

jest.mock("../../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (_req: any, _res: any, next: any) => next(),
}));

describe("Rotas de venda de rifas", () => {
  it("POST /rifas/vender -> deve chamar processarVenda", async () => {
    const app = criarAppRifasTeste(vendaRifasRoutes);

    const response = await request(app).post("/rifas/vender");

    expect(response.status).toBe(201);
    expect(response.body.acao).toBe("processar_venda");
  });
});
