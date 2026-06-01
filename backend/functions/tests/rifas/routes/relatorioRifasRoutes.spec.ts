// ============================================================================
// ARQUIVO: backend/functions/tests/rifas/routes/relatorioRifasRoutes.spec.ts
// ============================================================================
import request from "supertest";
import { describe, expect, it, jest } from "@jest/globals";

import relatorioRifasRoutes from "../../../src/modules/rifas/routes/relatorioRifasRoutes";
import { criarAppRifasTeste } from "../helpers/criarAppRifasTeste";

jest.mock("../../../src/modules/rifas/rifasController", () => ({
  rifasController: {
    obterRelatorioTesouraria: (_req: any, res: any) =>
      res.status(200).json({ acao: "relatorio_tesouraria" }),

    obterHistoricoDetalhado: (_req: any, res: any) =>
      res.status(200).json({ acao: "historico_detalhado" }),
  },
}));

jest.mock("../../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (_req: any, _res: any, next: any) => next(),
}));

describe("Rotas de relatórios de rifas", () => {
  it("GET /rifas/relatorio -> deve chamar obterRelatorioTesouraria", async () => {
    const app = criarAppRifasTeste(relatorioRifasRoutes);

    const response = await request(app).get("/rifas/relatorio");

    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("relatorio_tesouraria");
  });

  it("GET /rifas/historico -> deve chamar obterHistoricoDetalhado", async () => {
    const app = criarAppRifasTeste(relatorioRifasRoutes);

    const response = await request(app).get("/rifas/historico");

    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("historico_detalhado");
  });
});
