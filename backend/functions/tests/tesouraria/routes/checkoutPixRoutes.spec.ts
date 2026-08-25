import request from "supertest";
import { describe, expect, it, jest } from "@jest/globals";

import checkoutPixRoutes from "../../../src/modules/tesouraria/routes/checkoutPixRoutes";
import { criarAppTesourariaTeste } from "../../tesouraria/helpers/criarAppTesourariaTeste";

jest.mock("../../../src/modules/tesouraria/controllers/criarCheckoutPixController", () => ({
  criarCheckoutPix: (_req: any, res: any) =>
    res.status(201).json({ acao: "criar_checkout_pix" }),
}));

jest.mock("../../../src/modules/tesouraria/controllers/consultarCheckoutPixController", () => ({
  consultarCheckoutPix: (_req: any, res: any) =>
    res.status(200).json({ acao: "consultar_checkout_pix" }),
}));

jest.mock("../../../src/modules/tesouraria/controllers/receberWebhookCheckoutPixController", () => ({
  receberWebhookCheckoutPix: (_req: any, res: any) =>
    res.status(200).json({ acao: "webhook_checkout_pix" }),
}));

jest.mock("../../../src/shared/middlewares/authMiddleware", () => ({
  validateToken: (_req: any, _res: any, next: any) => next(),
}));

describe("Rotas: checkout Pix de rifas", () => {
  it("POST /checkout/pix -> deve criar cobrança Pix", async () => {
    const app = criarAppTesourariaTeste(checkoutPixRoutes);

    const response = await request(app)
      .post("/tesouraria/checkout/pix")
      .send({
        nome: "Maria",
        telefone: "35999990000",
        documento: "11111111111",
        numerosRifas: ["001"],
      });

    expect(response.status).toBe(201);
    expect(response.body.acao).toBe("criar_checkout_pix");
  });

  it("POST /checkout/pix -> deve validar payload antes do controller", async () => {
    const app = criarAppTesourariaTeste(checkoutPixRoutes);

    const response = await request(app).post("/tesouraria/checkout/pix").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Dados inválidos.");
  });

  it("GET /checkout/pix/:id -> deve consultar cobrança Pix", async () => {
    const app = criarAppTesourariaTeste(checkoutPixRoutes);

    const response = await request(app).get("/tesouraria/checkout/pix/ORDE_001");

    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("consultar_checkout_pix");
  });

  it("POST /checkout/pix/webhook -> deve receber webhook sem middleware de token", async () => {
    const app = criarAppTesourariaTeste(checkoutPixRoutes);

    const response = await request(app).post("/tesouraria/checkout/pix/webhook");

    expect(response.status).toBe(200);
    expect(response.body.acao).toBe("webhook_checkout_pix");
  });
});
