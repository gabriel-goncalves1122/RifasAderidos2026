// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/formatadoresAderido.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import {
  formatarDataHoraBR,
  formatarMoedaBR,
} from "@/features/aderidos/utils/formatadoresAderido";

// Normaliza espaços especiais gerados pelo Intl.NumberFormat, como NBSP.
function normalizarEspacos(valor: string) {
  return valor.replace(/\u00A0/g, " ").trim();
}

describe("Utils: formatadoresAderido", () => {
  it("Deve formatar valores monetários no padrão brasileiro", () => {
    expect(normalizarEspacos(formatarMoedaBR(0))).toBe("R$ 0,00");
    expect(normalizarEspacos(formatarMoedaBR(2.5))).toBe("R$ 2,50");
    expect(normalizarEspacos(formatarMoedaBR(150))).toBe("R$ 150,00");
  });

  it("Deve formatar data e hora no padrão brasileiro", () => {
    const data = "2026-05-10T14:30:00.000Z";

    const resultado = formatarDataHoraBR(data);

    expect(resultado).toMatch(/10\/05\/2026/);
  });

  it("Deve retornar texto padrão quando a data não existir", () => {
    expect(formatarDataHoraBR(null)).toBe("Data não registrada");
    expect(formatarDataHoraBR(undefined)).toBe("Data não registrada");
  });

  it("Deve retornar texto de data inválida quando a data for inválida", () => {
    expect(formatarDataHoraBR("data-invalida")).toBe("Data inválida");
  });
});
