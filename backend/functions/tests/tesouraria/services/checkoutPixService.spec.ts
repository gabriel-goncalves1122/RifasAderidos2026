import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockRunTransaction = jest.fn<any>();
const mockCriarPedidoPix = jest.fn<any>();
const mockConsultarPedido = jest.fn<any>();
const mockObterContextoAderidoPorEmail = jest.fn<any>();
const mockTransactionSet = jest.fn<any>();
const mockTransactionDelete = jest.fn<any>();

const bilhetes = new Map<string, any>();
const pagamentos = new Map<string, any>();
const compradores = new Map<string, any>();
const locks = new Map<string, any>();

type CollectionName =
  | "bilhetes"
  | "compradores"
  | "pagamentos_pix"
  | "pagamentos_pix_idempotencia";

interface MockRef {
  collectionName: CollectionName;
  id: string;
  get: () => Promise<{ exists: boolean; data: () => any }>;
  set: (data: any, options?: { merge?: boolean }) => Promise<void>;
}

function storeFor(collectionName: CollectionName) {
  if (collectionName === "bilhetes") return bilhetes;
  if (collectionName === "compradores") return compradores;
  if (collectionName === "pagamentos_pix") return pagamentos;
  return locks;
}

function makeRef(collectionName: CollectionName, id: string): MockRef {
  const store = storeFor(collectionName);

  return {
    collectionName,
    id,
    get: async () => ({
      exists: store.has(id),
      data: () => store.get(id),
    }),
    set: async (data: any, options?: { merge?: boolean }) => {
      const atual = store.get(id) || {};
      store.set(id, options?.merge ? { ...atual, ...data } : data);
    },
  };
}

function makeCollection(collectionName: CollectionName) {
  return {
    doc: (id?: string) => {
      if (id) return makeRef(collectionName, id);

      if (collectionName === "compradores") {
        return makeRef(collectionName, "COMPRADOR_001");
      }

      if (collectionName === "pagamentos_pix") {
        return makeRef(collectionName, "PAGAMENTO_001");
      }

      return makeRef(collectionName, `${collectionName}_AUTO`);
    },
  };
}

jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn((nome: CollectionName) => makeCollection(nome)),
    runTransaction: mockRunTransaction,
  }),
}));

jest.mock("../../../src/modules/rifas/helpers/usuarioRifasHelper", () => ({
  obterContextoAderidoPorEmail: mockObterContextoAderidoPorEmail,
}));

jest.mock("../../../src/shared/services/mercadoPagoPixClient", () => ({
  MercadoPagoPixClient: {
    criarPedidoPix: mockCriarPedidoPix,
    consultarPedido: mockConsultarPedido,
  },
}));

import { CriarCheckoutPixService } from "../../../src/modules/tesouraria/services/criarCheckoutPixService";
import { ConsultarCheckoutPixService } from "../../../src/modules/tesouraria/services/consultarCheckoutPixService";

describe("Service: CheckoutPixService (Criar e Consultar)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bilhetes.clear();
    pagamentos.clear();
    compradores.clear();
    locks.clear();

    mockRunTransaction.mockImplementation(async (callback: any) => {
      return callback({
        get: async (ref: MockRef) => ref.get(),
        set: (ref: MockRef, data: any, options?: { merge?: boolean }) => {
          mockTransactionSet(ref, data, options);
          const store = storeFor(ref.collectionName);
          const atual = store.get(ref.id) || {};
          store.set(ref.id, options?.merge ? { ...atual, ...data } : data);
        },
        delete: (ref: MockRef) => {
          mockTransactionDelete(ref);
          storeFor(ref.collectionName).delete(ref.id);
        },
      });
    });
    mockObterContextoAderidoPorEmail.mockResolvedValue({
      idAderido: "ADERIDO_001",
      vendedorNome: "Aderido Teste",
      vendedorCpf: "123",
    });
    mockCriarPedidoPix.mockResolvedValue({
      id: "ORDE_001",
      point_of_interaction: {
        transaction_data: {
          qr_code: "000201PIX",
          qr_code_base64: "base64",
        }
      },
      date_of_expiration: "2026-06-09T10:00:00-03:00"
    });
  });

  it("Deve criar cobrança Pix em duas fases e reservar rifas disponíveis", async () => {
    bilhetes.set("001", { numero: "001", status: "disponivel" });
    bilhetes.set("002", { numero: "002", status: "disponivel" });

    const resposta = await CriarCheckoutPixService.executar(
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
        expirationDate: expect.any(String),
      }),
    );
    expect(compradores.get("COMPRADOR_001")).toEqual(
      expect.objectContaining({ nome: "Maria" }),
    );
    expect(pagamentos.get("PAGAMENTO_001")).toEqual(
      expect.objectContaining({
        id: "PAGAMENTO_001",
        pix_order_id: "ORDE_001",
        pix_qr_code_id: "ORDE_001",
        copia_e_cola: "000201PIX",
        status_pagamento_banco: "WAITING",
        data_criacao: expect.any(String),
        idempotency_key: expect.any(String),
        reference_id: "rifas-pix-COMPRADOR_001",
        data_expiracao: "2026-06-09T10:00:00-03:00",
        qr_code_base64: "base64",
        qr_code_imagem_url: null,
      }),
    );
    expect(bilhetes.get("001")).toEqual(
      expect.objectContaining({
        status: "reservado",
        pix_order_id: "ORDE_001",
        status_pagamento_banco: "WAITING",
      }),
    );
    expect(locks.size).toBe(1);
    expect(resposta).toEqual({
      id: "PAGAMENTO_001",
      status: "aguardando_pagamento",
      qrCodeImagemUrl: null,
      qrCodeBase64: "base64",
      copiaECola: "000201PIX",
      expiraEm: "2026-06-09T10:00:00-03:00",
    });
  });

  it("Deve reaproveitar cobrança ativa pela chave de idempotência", async () => {
    bilhetes.set("001", { numero: "001", status: "disponivel" });

    const respostaInicial = await CriarCheckoutPixService.executar(
      "uid_001",
      "aderido@teste.com",
      {
        nome: "Maria",
        telefone: "35999990000",
        numerosRifas: ["001"],
      },
    );

    mockCriarPedidoPix.mockClear();

    const resposta = await CriarCheckoutPixService.executar(
      "uid_001",
      "aderido@teste.com",
      {
        nome: "Maria",
        telefone: "35999990000",
        numerosRifas: ["001"],
      },
    );

    expect(respostaInicial.id).toBe("PAGAMENTO_001");
    expect(resposta.id).toBe("PAGAMENTO_001");
    expect(mockCriarPedidoPix).not.toHaveBeenCalled();
  });

  it("Deve compensar reserva se o provedor falhar antes de criar pedido válido", async () => {
    bilhetes.set("001", { numero: "001", status: "disponivel" });
    mockCriarPedidoPix.mockRejectedValueOnce(new Error("MERCADOPAGO_OFFLINE"));

    await expect(
      CriarCheckoutPixService.executar("uid_001", "aderido@teste.com", {
        nome: "Maria",
        telefone: "35999990000",
        numerosRifas: ["001"],
      }),
    ).rejects.toThrow("MERCADOPAGO_OFFLINE");

    expect(pagamentos.get("PAGAMENTO_001")).toEqual(
      expect.objectContaining({
        status_pagamento_banco: "ERRO_CRIACAO",
        erro_criacao: "MERCADOPAGO_OFFLINE",
      }),
    );
    expect(bilhetes.get("001")).toEqual(
      expect.objectContaining({
        status: "disponivel",
        comprador_id: null,
        pix_reference_id: null,
        status_pagamento_banco: "ERRO_CRIACAO",
      }),
    );
    expect(locks.size).toBe(0);
  });

  it("Deve rejeitar rifa indisponível antes de chamar o provedor", async () => {
    bilhetes.set("001", { numero: "001", status: "pago" });

    await expect(
      CriarCheckoutPixService.executar("uid_001", "aderido@teste.com", {
        nome: "Maria",
        telefone: "35999990000",
        numerosRifas: ["001"],
      }),
    ).rejects.toThrow("RIFA_INDISPONIVEL");

    expect(mockCriarPedidoPix).not.toHaveBeenCalled();
  });

  it("Deve consultar cobrança do aderido dono", async () => {
    pagamentos.set("PAGAMENTO_001", {
      id: "PAGAMENTO_001",
      vendedor_id: "ADERIDO_001",
      status_pagamento_banco: "PAID",
      copia_e_cola: "000201PIX",
      qr_code_imagem_url: "https://qrcode.png",
      data_expiracao: "2026-06-09T10:00:00-03:00",
    });

    const resposta = await ConsultarCheckoutPixService.executar(
      "aderido@teste.com",
      "PAGAMENTO_001",
    );

    expect(resposta.status).toBe("pago");
    expect(resposta.copiaECola).toBe("000201PIX");
  });
});
