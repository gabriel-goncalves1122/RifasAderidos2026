import request from "supertest";
import { describe, expect, it, jest } from "@jest/globals";

import checkoutPixRoutes from "../../../src/modules/rifas/routes/checkoutPixRoutes";
import { criarAppRifasTeste } from "../helpers/criarAppRifasTeste";

jest.mock("../../../src/modules/rifas/rifasController", () => ({
  rifasController: {
    criarCheckoutPix: (_req: any, res: any) =>
      res.status(201).json({ acao: "criar_checkout_pix" }),
    consultarCheckoutPix: (_req: any, res: any) =>
      res.status(200).json({ acao: "consultar_checkout_pix" }),
    receberWebhookCheckoutPix: (_req: any, res: any) =>
      res.status(200).json({ acao: "webhook_checkout_pix" }),
  },
}));

jest.mock("../../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (_req: any, _res: any, next: any) => next(),
}));

describe("Rotas: checkout Pix de rifas", () => {
  it("POST /rifas/checkout/pix -> deve criar cobrança Pix", async () => {
    const app = criarAppRifasTeste(checkoutPixRoutes);

    const response = await request(app).post("/rifas/checkout/pix");

    expect(response.status).toBe(201);
    expect(response.body.acao).toBe("criar_checkout_pix");
  });

  it("GET /rifas/checkout/pix/:id -> deve consultar cobrança Pix", async () => {
    const app = criarAppRifasTeste(checkoutPixRoutes);

    const response = await request(app).get("/rifas/checkout/pix/ORDE_001");

    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("consultar_checkout_pix");
  });

  it("POST /rifas/checkout/pix/webhook -> deve receber webhook sem middleware de token", async () => {
    const app = criarAppRifasTeste(checkoutPixRoutes);

    const response = await request(app).post("/rifas/checkout/pix/webhook");

    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("webhook_checkout_pix");
  });
});
