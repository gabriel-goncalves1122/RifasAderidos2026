// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/agruparRifasRecusadas.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import { agruparRifasRecusadas } from "@/features/aderidos/utils/agruparRifasRecusadas";

describe("Utils: agruparRifasRecusadas", () => {
  it("Deve retornar array vazio quando não houver rifas recusadas", () => {
    const resultado = agruparRifasRecusadas([
      {
        numero: "001",
        status: "disponivel",
      },
      {
        numero: "002",
        status: "pago",
      },
    ] as any);

    expect(resultado).toEqual([]);
  });

  it("Deve agrupar rifas recusadas do mesmo comprador, motivo e data", () => {
    const resultado = agruparRifasRecusadas([
      {
        numero: "010",
        status: "recusado",
        comprador_nome: "Ana Beatriz",
        comprador_email: "ana@email.com",
        comprador_telefone: "(11) 99999-9999",
        motivo_recusa: "Comprovante ilegível",
        data_reserva: "2026-05-10T10:00:00.000Z",
      },
      {
        numero: "011",
        status: "recusado",
        comprador_nome: "Ana Beatriz",
        comprador_email: "ana@email.com",
        comprador_telefone: "(11) 99999-9999",
        motivo_recusa: "Comprovante ilegível",
        data_reserva: "2026-05-10T12:00:00.000Z",
      },
    ] as any);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].comprador).toBe("Ana Beatriz");
    expect(resultado[0].email).toBe("ana@email.com");
    expect(resultado[0].telefone).toBe("(11) 99999-9999");
    expect(resultado[0].motivo).toBe("Comprovante ilegível");
    expect(resultado[0].bilhetes).toEqual(["010", "011"]);
  });

  it("Deve separar compradores diferentes em grupos diferentes", () => {
    const resultado = agruparRifasRecusadas([
      {
        numero: "010",
        status: "recusado",
        comprador_nome: "Ana Beatriz",
        comprador_email: "ana@email.com",
        comprador_telefone: "(11) 99999-9999",
        data_reserva: "2026-05-10T10:00:00.000Z",
      },
      {
        numero: "020",
        status: "recusado",
        comprador_nome: "Carlos Silva",
        comprador_email: "carlos@email.com",
        comprador_telefone: "(35) 99999-9999",
        data_reserva: "2026-05-10T10:00:00.000Z",
      },
    ] as any);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].bilhetes).toEqual(["010"]);
    expect(resultado[1].bilhetes).toEqual(["020"]);
  });

  it("Deve usar dados padrão quando comprador não estiver preenchido", () => {
    const resultado = agruparRifasRecusadas([
      {
        numero: "030",
        status: "recusado",
      },
    ] as any);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].comprador).toBe("Desconhecido");
    expect(resultado[0].motivo).toBe("Sem motivo informado");
    expect(resultado[0].bilhetes).toEqual(["030"]);
  });
});
