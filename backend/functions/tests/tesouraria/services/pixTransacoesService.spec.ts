// ============================================================================
// ARQUIVO: backend/functions/tests/tesouraria/services/pixTransacoesService.spec.ts
// ============================================================================
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockWhere = jest.fn<any>();
const mockGet = jest.fn<any>();

jest.mock("firebase-admin", () => {
  const collectionMock = {
    where: mockWhere.mockReturnThis(),
    get: mockGet,
  };

  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(collectionMock),
    }),
  };
});

import { PixTransacoesService } from "../../../src/modules/tesouraria/services/pixTransacoesService";

describe("Service: PixTransacoesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve normalizar bilhetes em transações Pix agrupadas por comprovante", async () => {
    mockGet.mockResolvedValueOnce({
      docs: [
        {
          id: "002",
          data: () => ({
            status: "pago",
            comprador_id: "COMPRA_001",
            comprador_nome: "Ana",
            comprador_email: "ana@teste.com",
            comprador_telefone: "11999999999",
            vendedor_id: "ADERIDO_001",
            vendedor_nome: "Aderido Um",
            vendedor_cpf: "111",
            comprovante_url: "https://storage.mock/comprovante-1.png",
            data_reserva: "2026-01-01T10:00:00.000Z",
            data_pagamento: "2026-01-02T10:00:00.000Z",
          }),
        },
        {
          id: "001",
          data: () => ({
            status: "pago",
            comprador_id: "COMPRA_001",
            comprador_nome: "Ana",
            vendedor_id: "ADERIDO_001",
            vendedor_nome: "Aderido Um",
            vendedor_cpf: "111",
            comprovante_url: "https://storage.mock/comprovante-1.png",
            data_reserva: "2026-01-01T10:00:00.000Z",
            data_pagamento: "2026-01-02T10:00:00.000Z",
          }),
        },
        {
          id: "003",
          data: () => ({
            status: "pendente",
            comprador_id: "COMPRA_002",
            comprador_nome: "Bruno",
            data_reserva: "2026-01-03T10:00:00.000Z",
          }),
        },
      ],
    });

    const resultado = await PixTransacoesService.buscarTransacoes();
    const transacaoPaga = resultado.find(
      (transacao: any) => transacao.id === "comprovante-https-storage-mock-comprovante-1-png",
    );

    expect(mockWhere).toHaveBeenCalledWith("status", "in", [
      "pago",
      "pendente",
      "recusado",
      "reservado",
    ]);
    expect(resultado).toHaveLength(2);
    expect(transacaoPaga).toEqual(
      expect.objectContaining({
        metodo: "PIX",
        statusPagamento: "PAID",
        valorBruto: 20,
        valorPago: 20,
        compradorNome: "Ana",
        quantidadeRifas: 2,
      }),
    );
    expect(transacaoPaga?.rifas).toEqual([
      { numero: "001", status: "pago" },
      { numero: "002", status: "pago" },
    ]);
  });

  it("Deve retornar sincronização vazia quando não houver cobrança aberta", async () => {
    mockGet.mockResolvedValueOnce({
      empty: true,
      docs: [],
    });

    await expect(PixTransacoesService.sincronizar()).resolves.toEqual({
      sucesso: true,
      sincronizado: false,
      atualizados: 0,
      mensagem: "Nenhuma cobrança Pix aberta para sincronizar.",
    });
  });

  it("Deve calcular o resumo das transações Pix", async () => {
    mockGet.mockResolvedValueOnce({
      docs: [
        {
          id: "001",
          data: () => ({
            status: "pago",
            comprador_id: "COMPRA_001",
            comprador_nome: "Ana",
            data_reserva: "2026-01-01T10:00:00.000Z",
          }),
        },
      ],
    });

    const resumo = await PixTransacoesService.obterResumo();
    expect(resumo).toEqual(
      expect.objectContaining({
        quantidadePagas: 1,
        totalRecebido: 10,
      })
    );
  });
});
