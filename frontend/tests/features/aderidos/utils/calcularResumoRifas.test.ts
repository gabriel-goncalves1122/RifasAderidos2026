// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/calcularResumoRifas.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import {
  calcularValorArrecadado,
  contarNotificacoesNaoLidas,
  filtrarRifasPorStatus,
} from "@/features/aderidos/utils/calcularResumoRifas";

describe("Utils: calcularResumoRifas", () => {
  const rifas = [
    {
      numero: "001",
      status: "disponivel",
    },
    {
      numero: "002",
      status: "pago",
    },
    {
      numero: "003",
      status: "pendente",
    },
    {
      numero: "004",
      status: "recusado",
    },
    {
      numero: "005",
      status: "pago",
    },
  ] as any;

  it("Deve calcular valor arrecadado considerando apenas rifas pagas", () => {
    const resultado = calcularValorArrecadado(rifas);

    expect(resultado).toBe(20);
  });

  it("Deve filtrar rifas por status específico", () => {
    const resultado = filtrarRifasPorStatus(rifas, "pago");

    expect(resultado).toHaveLength(2);
    expect(resultado.map((rifa) => rifa.numero)).toEqual(["002", "005"]);
  });

  it("Deve retornar todas as rifas quando o filtro for todas", () => {
    const resultado = filtrarRifasPorStatus(rifas, "todas");

    expect(resultado).toHaveLength(5);
  });

  it("Deve contar notificações não lidas", () => {
    const resultado = contarNotificacoesNaoLidas([
      {
        id: "1",
        lida: false,
      },
      {
        id: "2",
        lida: true,
      },
      {
        id: "3",
        lida: false,
      },
    ] as any);

    expect(resultado).toBe(2);
  });
});
