import { describe, expect, it } from "vitest";

import {
  agruparPixAderidos,
  META_RIFAS_ADERIDO,
} from "@/features/tesouraria/utils/pixAderidosUtils";
import { PixTransacao } from "@/features/tesouraria/types/pixTransacoes";

function criarTransacao(
  parcial: Partial<PixTransacao>,
): PixTransacao {
  return {
    id: parcial.id || "tx_teste",
    referenceId: parcial.referenceId || "ref_teste",
    metodo: "PIX",
    statusPagamento: parcial.statusPagamento || "PAID",
    statusConciliacao: parcial.statusConciliacao || "conciliada",
    valorBruto: parcial.valorBruto ?? 10,
    valorPago: parcial.valorPago ?? 10,
    moeda: "BRL",
    dataCriacao: parcial.dataCriacao || "2026-10-01T10:00:00.000-03:00",
    ...parcial,
  };
}

describe("Utils: pixAderidosUtils", () => {
  it("Deve agrupar aderidos por CPF e preservar o CPF formatado", () => {
    const resultado = agruparPixAderidos([
      criarTransacao({
        id: "tx_001",
        valorPago: 20,
        aderido: {
          nome: "Gabriel Sampaio",
          cpf: "11122233344",
        },
        rifas: [{ numero: "001", status: "pago" }],
      }),
      criarTransacao({
        id: "tx_002",
        valorPago: 30,
        aderido: {
          nome: "Gabriel Sampaio",
          cpf: "111.222.333-44",
        },
        rifas: [{ numero: "002", status: "pago" }],
      }),
    ]);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe("Gabriel Sampaio");
    expect(resultado[0].cpfLabel).toBe("111.222.333-44");
    expect(resultado[0].totalArrecadado).toBe(50);
  });

  it("Deve usar fallback quando CPF e aderido não estiverem vinculados", () => {
    const resultado = agruparPixAderidos([
      criarTransacao({
        id: "tx_sem_aderido",
        valorPago: 10,
        aderido: undefined,
        quantidadeRifas: 1,
      }),
    ]);

    expect(resultado[0].nome).toBe("Sem aderido vinculado");
    expect(resultado[0].cpfLabel).toBe("CPF não informado");
  });

  it("Deve contar rifas pagas únicas usando rifas vinculadas", () => {
    const resultado = agruparPixAderidos([
      criarTransacao({
        id: "tx_001",
        aderido: { nome: "Ana", cpf: "00000000000" },
        rifas: [
          { numero: "001", status: "pago" },
          { numero: "001", status: "pago" },
          { numero: "002" },
          { numero: "003", status: "disponivel" },
        ],
      }),
    ]);

    expect(resultado[0].rifasPagas).toBe(2);
    expect(resultado[0].rifasRestantes).toBe(META_RIFAS_ADERIDO - 2);
  });

  it("Deve usar quantidadeRifas como fallback legado", () => {
    const resultado = agruparPixAderidos([
      criarTransacao({
        id: "tx_legado",
        aderido: { nome: "Maria", cpf: "22233344455" },
        rifas: [],
        quantidadeRifas: 4,
      }),
    ]);

    expect(resultado[0].rifasPagas).toBe(4);
    expect(resultado[0].rifasRestantes).toBe(META_RIFAS_ADERIDO - 4);
  });

  it("Não deve deixar rifas restantes negativas", () => {
    const resultado = agruparPixAderidos([
      criarTransacao({
        id: "tx_meta",
        aderido: { nome: "Joao", cpf: "99988877766" },
        quantidadeRifas: 130,
      }),
    ]);

    expect(resultado[0].rifasRestantes).toBe(0);
  });
});
