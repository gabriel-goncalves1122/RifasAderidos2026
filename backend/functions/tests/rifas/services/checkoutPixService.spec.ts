import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockBatchSet = jest.fn<any>();
const mockBatchCommit = jest.fn<any>();
const mockRunTransaction = jest.fn<any>();
const mockCriarPedidoPix = jest.fn<any>();
const mockConsultarPedido = jest.fn<any>();
const mockObterContextoAderidoPorEmail = jest.fn<any>();
const bilhetes = new Map<string, any>();
let pagamentoPix: any = null;

jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn((nome: string) => {
      if (nome === "bilhetes") {
        return {
          doc: (id: string) => ({
            id,
            get: async () => ({
              exists: bilhetes.has(id),
              data: () => bilhetes.get(id),
            }),
          }),
        };
      }

      if (nome === "compradores") {
        return {
          doc: jest.fn().mockReturnValue({ id: "COMPRADOR_001" }),
        };
      }

      if (nome === "pagamentos_pix") {
        return {
          doc: jest.fn().mockReturnValue({
            id: "ORDE_001",
            get: async () => ({
              exists: Boolean(pagamentoPix),
              data: () => pagamentoPix,
            }),
          }),
        };
      }

      return { doc: jest.fn() };
    }),
    batch: jest.fn().mockReturnValue({
      set: mockBatchSet,
      commit: mockBatchCommit,
    }),
    runTransaction: mockRunTransaction,
  }),
}));

jest.mock("../../../src/modules/rifas/helpers/usuarioRifasHelper", () => ({
  obterContextoAderidoPorEmail: mockObterContextoAderidoPorEmail,
}));

jest.mock("../../../src/shared/services/pagBankPixClient", () => ({
  PagBankPixClient: {
    criarPedidoPix: mockCriarPedidoPix,
    consultarPedido: mockConsultarPedido,
  },
}));

import { CheckoutPixService } from "../../../src/modules/rifas/services/checkoutPixService";

describe("Service: CheckoutPixService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bilhetes.clear();
    pagamentoPix = null;
    mockBatchCommit.mockResolvedValue(true);
    mockRunTransaction.mockImplementation(async (callback: any) => {
      return callback({
        get: async (ref: { id: string }) => ({
          exists: bilhetes.has(ref.id),
          data: () => bilhetes.get(ref.id),
        }),
        set: mockBatchSet,
      });
    });
    mockObterContextoAderidoPorEmail.mockResolvedValue({
      idAderido: "ADERIDO_001",
      vendedorNome: "Aderido Teste",
      vendedorCpf: "123",
    });
    mockCriarPedidoPix.mockResolvedValue({
      id: "ORDE_001",
      qr_codes: [
        {
          id: "QRCO_001",
          text: "000201PIX",
          expiration_date: "2026-06-09T10:00:00-03:00",
          links: [{ media: "image/png", href: "https://qrcode.png" }],
        },
      ],
    });
  });

  it("Deve criar cobrança Pix e reservar rifas disponíveis", async () => {
    bilhetes.set("001", { numero: "001", status: "disponivel" });
    bilhetes.set("002", { numero: "002", status: "disponivel" });

    const resposta = await CheckoutPixService.criarCobrancaPix(
      "uid_001",
      "aderido@teste.com",
      {
        nome: "Maria",
        telefone: "35999990000",
        email: "maria@teste.com",
        numerosRifas: ["001", "002"],
      },
    );

    expect(mockCriarPedidoPix).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceId: "rifas-pix-COMPRADOR_001",
        nome: "Maria",
        numerosRifas: ["001", "002"],
        valorCentavos: 2000,
      }),
    );
    expect(mockBatchSet).toHaveBeenCalledTimes(4);
    expect(mockBatchSet).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: "reservado",
        pix_order_id: "ORDE_001",
        status_pagamento_banco: "WAITING",
      }),
      { merge: true },
    );
    expect(resposta).toEqual({
      id: "ORDE_001",
      status: "aguardando_pagamento",
      qrCodeImagemUrl: "https://qrcode.png",
      qrCodeBase64: null,
      copiaECola: "000201PIX",
      expiraEm: "2026-06-09T10:00:00-03:00",
    });
  });

  it("Deve rejeitar rifa indisponível antes de chamar o provedor", async () => {
    bilhetes.set("001", { numero: "001", status: "pago" });

    await expect(
      CheckoutPixService.criarCobrancaPix("uid_001", "aderido@teste.com", {
        nome: "Maria",
        telefone: "35999990000",
        numerosRifas: ["001"],
      }),
    ).rejects.toThrow("RIFA_INDISPONIVEL");

    expect(mockCriarPedidoPix).not.toHaveBeenCalled();
    expect(mockBatchCommit).not.toHaveBeenCalled();
  });

  it("Deve consultar cobrança do aderido dono", async () => {
    pagamentoPix = {
      id: "ORDE_001",
      vendedor_id: "ADERIDO_001",
      status_pagamento_banco: "PAID",
      copia_e_cola: "000201PIX",
      qr_code_imagem_url: "https://qrcode.png",
      data_expiracao: "2026-06-09T10:00:00-03:00",
    };

    const resposta = await CheckoutPixService.consultarCobrancaPix(
      "aderido@teste.com",
      "ORDE_001",
    );

    expect(resposta.status).toBe("pago");
    expect(resposta.copiaECola).toBe("000201PIX");
  });
});
