import { describe, expect, it } from "@jest/globals";

import {
  calcularValorPixCentavos,
  dataExpiracaoPix,
  mapearStatusCheckoutPix,
  montarIdempotencyKeyPix,
  normalizarDadosCheckoutPix,
  normalizarQrCodeMercadoPago,
} from "../../../src/modules/tesouraria/helpers/checkoutPixHelper";

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

  describe("normalizarQrCodeMercadoPago", () => {
    it("Deve lançar erro se o objeto ou ID/QR Code não existirem", () => {
      expect(() => normalizarQrCodeMercadoPago(null)).toThrow("MERCADOPAGO_QR_CODE_INVALIDO");
      expect(() => normalizarQrCodeMercadoPago({})).toThrow("MERCADOPAGO_QR_CODE_INVALIDO");
      expect(() => normalizarQrCodeMercadoPago({ id: "123" })).toThrow("MERCADOPAGO_QR_CODE_INVALIDO");
    });

    it("Deve normalizar QR Code retornado pelo Mercado Pago", () => {
      const qrCode = normalizarQrCodeMercadoPago({
        id: "PEDIDO_MP_123",
        point_of_interaction: {
          transaction_data: {
            qr_code: "00020126...COPIA-COLA",
            qr_code_base64: "base64..."
          }
        },
        date_of_expiration: "2026-07-09T12:00:00-03:00",
      });

      expect(qrCode.id).toBe("PEDIDO_MP_123");
      expect(qrCode.copiaECola).toBe("00020126...COPIA-COLA");
      expect(qrCode.expiraEm).toBe("2026-07-09T12:00:00-03:00");
      expect(qrCode.qrCodeBase64).toBe("base64...");
    });
  });



  it("Deve expirar cobrança Pix em cerca de cinco minutos", () => {
    const expiraEm = dataExpiracaoPix(new Date("2026-06-09T10:00:00.000Z"));

    expect(expiraEm).toBe("2026-06-09T07:05:00.000-03:00");
  });

  it("Deve montar chave idempotente estável por vendedor, rifas e janela", () => {
    const dataBase = new Date("2026-06-09T10:01:00.000Z");
    const chaveA = montarIdempotencyKeyPix({
      vendedorId: "ADERIDO_001",
      numerosRifas: ["002", "001"],
      dataBase,
    });
    const chaveB = montarIdempotencyKeyPix({
      vendedorId: "ADERIDO_001",
      numerosRifas: ["001", "002"],
      dataBase,
    });

    expect(chaveA).toBe(chaveB);
    expect(chaveA).toHaveLength(64);
  });

  it("Deve mapear status do Mercado Pago para CheckoutPixStatus", () => {
    expect(mapearStatusCheckoutPix("approved")).toBe("pago");
    expect(mapearStatusCheckoutPix("authorized")).toBe("pago");
    expect(mapearStatusCheckoutPix("rejected")).toBe("cancelado");
    expect(mapearStatusCheckoutPix("cancelled")).toBe("cancelado");
    expect(mapearStatusCheckoutPix("pending")).toBe("aguardando_pagamento");
    expect(mapearStatusCheckoutPix("in_process")).toBe("aguardando_pagamento");
  });
});
