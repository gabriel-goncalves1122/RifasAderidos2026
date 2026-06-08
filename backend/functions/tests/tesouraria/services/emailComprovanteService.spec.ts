import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockBilhetesWhere = jest.fn<any>();
const mockBilhetesGet = jest.fn<any>();
const mockEnviarEmailRecibo = jest.fn<any>();

const bilhetesCollectionMock = {
  where: mockBilhetesWhere.mockReturnThis(),
  get: mockBilhetesGet,
};

jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn((nome: string) => {
      if (nome === "bilhetes") return bilhetesCollectionMock;

      return {};
    }),
  }),
}));

jest.mock("../../../src/modules/rifas/emailService", () => ({
  enviarEmailRecibo: mockEnviarEmailRecibo,
}));

import { EmailComprovanteService } from "../../../src/modules/tesouraria/services/emailComprovanteService";

function criarDoc(id: string, dados: Record<string, unknown>) {
  return {
    id,
    data: () => dados,
  };
}

describe("Service: EmailComprovanteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnviarEmailRecibo.mockResolvedValue(true);
  });

  it("Deve reenviar recibo aprovado para compra paga", async () => {
    mockBilhetesGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        criarDoc("002", {
          status: "pago",
          comprador_email: "maria@teste.com",
          comprador_nome: "Maria Souza",
        }),
        criarDoc("001", {
          status: "pago",
          comprador_email: "maria@teste.com",
          comprador_nome: "Maria Souza",
        }),
      ],
    });

    const resultado =
      await EmailComprovanteService.reenviarEmailComprovante("comprador_123");

    expect(mockBilhetesWhere).toHaveBeenCalledWith(
      "comprador_id",
      "==",
      "comprador_123",
    );
    expect(mockEnviarEmailRecibo).toHaveBeenCalledWith(
      "maria@teste.com",
      "Maria Souza",
      ["001", "002"],
      "aprovado",
    );
    expect(resultado).toEqual({
      comprador_id: "comprador_123",
      email: "maria@teste.com",
      rifas: ["001", "002"],
      status: "aprovado",
    });
  });

  it("Deve lançar COMPRA_NAO_ENCONTRADA quando não houver bilhetes", async () => {
    mockBilhetesGet.mockResolvedValueOnce({
      empty: true,
      docs: [],
    });

    await expect(
      EmailComprovanteService.reenviarEmailComprovante("inexistente"),
    ).rejects.toThrow("COMPRA_NAO_ENCONTRADA");

    expect(mockEnviarEmailRecibo).not.toHaveBeenCalled();
  });

  it("Deve rejeitar compra pendente ou mista", async () => {
    mockBilhetesGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        criarDoc("001", {
          status: "pago",
          comprador_email: "maria@teste.com",
          comprador_nome: "Maria Souza",
        }),
        criarDoc("002", {
          status: "pendente",
          comprador_email: "maria@teste.com",
          comprador_nome: "Maria Souza",
        }),
      ],
    });

    await expect(
      EmailComprovanteService.reenviarEmailComprovante("comprador_123"),
    ).rejects.toThrow("COMPRA_NAO_PAGA");

    expect(mockEnviarEmailRecibo).not.toHaveBeenCalled();
  });

  it("Deve rejeitar compra sem e-mail do comprador", async () => {
    mockBilhetesGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        criarDoc("001", {
          status: "pago",
          comprador_email: "",
          comprador_nome: "Maria Souza",
        }),
      ],
    });

    await expect(
      EmailComprovanteService.reenviarEmailComprovante("comprador_123"),
    ).rejects.toThrow("COMPRA_SEM_EMAIL");

    expect(mockEnviarEmailRecibo).not.toHaveBeenCalled();
  });

  it("Deve rejeitar quando envio não for confirmado", async () => {
    mockEnviarEmailRecibo.mockResolvedValueOnce(false);
    mockBilhetesGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        criarDoc("001", {
          status: "pago",
          comprador_email: "maria@teste.com",
          comprador_nome: "Maria Souza",
        }),
      ],
    });

    await expect(
      EmailComprovanteService.reenviarEmailComprovante("comprador_123"),
    ).rejects.toThrow("EMAIL_COMPROVANTE_NAO_ENVIADO");
  });
});
