import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockTransactionSet = jest.fn<any>();
const mockTransactionGet = jest.fn<any>();
const mockRunTransaction = jest.fn<any>();
const pagamentos = new Map<string, any>();

jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn((nome: string) => {
      if (nome === "pagamentos_pix") {
        return {
          doc: (id: string) => ({
            id,
            get: async () => ({
              exists: pagamentos.has(id),
            }),
          }),
          where: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          get: async () => ({
            empty: true,
            docs: [],
          }),
        };
      }

      if (nome === "notificacoes") {
        return {
          doc: () => ({ id: "NOTIFICACAO_001" }),
        };
      }

      return {
        doc: (id: string) => ({ id }),
      };
    }),
    runTransaction: mockRunTransaction,
  }),
}));

import { calcularAssinaturaWebhook } from "../../../src/modules/rifas/helpers/checkoutPixHelper";
import { CheckoutPixWebhookService } from "../../../src/modules/rifas/services/checkoutPixWebhookService";

describe("Service: CheckoutPixWebhookService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pagamentos.clear();
    process.env.PAGBANK_WEBHOOK_TOKEN = "token-webhook";

    mockRunTransaction.mockImplementation(async (callback: any) => {
      return callback({
        get: mockTransactionGet,
        set: mockTransactionSet,
      });
    });
  });

  it("Deve rejeitar assinatura inválida antes de processar o banco", async () => {
    await expect(
      CheckoutPixWebhookService.processarWebhook({
        payload: { id: "ORDE_001" },
        rawBody: JSON.stringify({ id: "ORDE_001" }),
        assinatura: "assinatura-invalida",
      }),
    ).rejects.toThrow("INVALID_SIGNATURE");

    expect(mockRunTransaction).not.toHaveBeenCalled();
  });

  it("Deve marcar rifas como pendentes quando o banco confirmar pagamento", async () => {
    pagamentos.set("ORDE_001", {
      id: "ORDE_001",
      pix_order_id: "ORDE_001",
      vendedor_id: "ADERIDO_001",
      numeros_rifas: ["001", "002"],
      status_pagamento_banco: "WAITING",
      valor_bruto: 20,
      valor_pago: 0,
    });

    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ORDE_001",
        pix_order_id: "ORDE_001",
        vendedor_id: "ADERIDO_001",
        numeros_rifas: ["001", "002"],
        status_pagamento_banco: "WAITING",
        valor_bruto: 20,
        valor_pago: 0,
      }),
    });

    const payload = {
      id: "ORDE_001",
      charges: [
        {
          id: "CHAR_001",
          status: "PAID",
          amount: { value: 2000 },
          paid_at: "2026-06-08T12:00:00-03:00",
        },
      ],
    };

    const resultado =
      await CheckoutPixWebhookService.processarPayloadConfiavel(payload);

    expect(resultado).toEqual({
      sucesso: true,
      idempotente: false,
      status: "PAID",
    });
    expect(mockTransactionSet).toHaveBeenCalledWith(
      expect.objectContaining({ id: "001" }),
      expect.objectContaining({
        status: "pendente",
        status_pagamento_banco: "PAID",
        pix_order_id: "ORDE_001",
        pix_charge_id: "CHAR_001",
        valor_pago: 10,
      }),
      { merge: true },
    );
    expect(mockRunTransaction).toHaveBeenCalledTimes(1);
  });

  it("Deve liberar rifas e criar notificação quando o banco cancelar", async () => {
    pagamentos.set("ORDE_002", {
      id: "ORDE_002",
      pix_order_id: "ORDE_002",
      vendedor_id: "ADERIDO_001",
      numeros_rifas: ["010"],
      status_pagamento_banco: "WAITING",
      valor_bruto: 10,
      valor_pago: 0,
    });

    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ORDE_002",
        pix_order_id: "ORDE_002",
        vendedor_id: "ADERIDO_001",
        numeros_rifas: ["010"],
        status_pagamento_banco: "WAITING",
        valor_bruto: 10,
        valor_pago: 0,
      }),
    });

    await CheckoutPixWebhookService.processarPayloadConfiavel({
      id: "ORDE_002",
      charges: [
        {
          status: "CANCELED",
          payment_response: { message: "Pagamento cancelado pelo banco" },
        },
      ],
    });

    expect(mockTransactionSet).toHaveBeenCalledWith(
      expect.objectContaining({ id: "010" }),
      expect.objectContaining({
        status: "disponivel",
        comprador_id: null,
        status_pagamento_banco: "CANCELED",
        valor_pago: 0,
        motivo_recusa: "Pagamento cancelado pelo banco",
      }),
      { merge: true },
    );
    expect(mockTransactionSet).toHaveBeenCalledWith(
      expect.objectContaining({ id: "NOTIFICACAO_001" }),
      expect.objectContaining({
        vendedor_id: "ADERIDO_001",
        tipo: "rifa_liberada",
        rifas: ["010"],
      }),
    );
  });

  it("Deve tratar payload repetido como idempotente", async () => {
    pagamentos.set("ORDE_003", {
      id: "ORDE_003",
      pix_order_id: "ORDE_003",
      numeros_rifas: ["020"],
      status_pagamento_banco: "PAID",
    });

    mockTransactionGet.mockResolvedValueOnce({
      exists: true,
      data: () => ({
        id: "ORDE_003",
        pix_order_id: "ORDE_003",
        numeros_rifas: ["020"],
        status_pagamento_banco: "PAID",
      }),
    });

    const rawBody = JSON.stringify({
      id: "ORDE_003",
      charges: [{ status: "PAID" }],
    });
    const assinatura = calcularAssinaturaWebhook(rawBody, "token-webhook");

    const resultado = await CheckoutPixWebhookService.processarWebhook({
      payload: JSON.parse(rawBody),
      rawBody,
      assinatura,
    });

    expect(resultado).toEqual({
      sucesso: true,
      idempotente: true,
      status: "PAID",
    });
    expect(mockTransactionSet).toHaveBeenCalledWith(
      expect.anything(),
      { raw_pagbank: JSON.parse(rawBody) },
      { merge: true },
    );
    expect(mockRunTransaction).toHaveBeenCalledTimes(1);
  });
});
