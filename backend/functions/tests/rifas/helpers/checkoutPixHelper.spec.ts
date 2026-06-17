import { describe, expect, it } from "@jest/globals";

import {
  calcularAssinaturaWebhook,
  calcularValorPixCentavos,
  mapearStatusCheckoutPix,
  normalizarDadosCheckoutPix,
  normalizarQrCodePagBank,
  validarAssinaturaWebhookPix,
} from "../../../src/modules/rifas/helpers/checkoutPixHelper";

describe("Helper: checkoutPixHelper", () => {
  it("Deve normalizar payload de checkout Pix", () => {
    const dados = normalizarDadosCheckoutPix({
      nome: " Maria ",
      telefone: "(35) 99999-0000",
      email: "maria@teste.com",
      documento: "123.456.789-09",
      numerosRifas: ["001", "001", "002"],
    });

    expect(dados).toEqual({
      nome: "Maria",
      telefone: "35999990000",
      email: "maria@teste.com",
      documento: "12345678909",
      numerosRifas: ["001", "002"],
    });
    expect(calcularValorPixCentavos(dados.numerosRifas)).toBe(2000);
  });

  it("Deve rejeitar payload incompleto", () => {
    expect(() =>
      normalizarDadosCheckoutPix({
        nome: "",
        telefone: "",
        numerosRifas: [],
      }),
    ).toThrow("INVALID_DATA");
  });

  it("Deve normalizar QR Code retornado pelo PagBank", () => {
    const qrCode = normalizarQrCodePagBank({
      qr_codes: [
        {
          id: "QRCO_001",
          text: "000201PIX",
          expiration_date: "2026-06-09T10:00:00-03:00",
          links: [
            {
              media: "image/png",
              href: "https://sandbox/qrcode.png",
            },
          ],
        },
      ],
    });

    expect(qrCode).toEqual({
      id: "QRCO_001",
      copiaECola: "000201PIX",
      expiraEm: "2026-06-09T10:00:00-03:00",
      qrCodeImagemUrl: "https://sandbox/qrcode.png",
      qrCodeBase64: null,
    });
  });

  it("Deve validar assinatura de webhook Pix (HMAC-SHA256 base64)", () => {
    const rawBody = JSON.stringify({ id: "ORDE_001" });
    const token = "token_teste";
    const assinatura = calcularAssinaturaWebhook(rawBody, token);

    expect(
      validarAssinaturaWebhookPix({
        rawBody,
        token,
        assinaturaRecebida: assinatura,
      }),
    ).toBe(true);
    expect(
      validarAssinaturaWebhookPix({
        rawBody,
        token,
        assinaturaRecebida: "AA==",
      }),
    ).toBe(false);
  });

  it("Deve mapear status para o contrato do checkout", () => {
    expect(mapearStatusCheckoutPix("PAID")).toBe("pago");
    expect(mapearStatusCheckoutPix("AUTHORIZED")).toBe("pago");
    expect(mapearStatusCheckoutPix("CANCELED")).toBe("cancelado");
    expect(mapearStatusCheckoutPix("WAITING")).toBe("aguardando_pagamento");
  });
});
