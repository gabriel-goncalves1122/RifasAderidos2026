import { describe, expect, it } from "vitest";

import {
  formatarData,
  formatarMoeda,
} from "@/shared/utils/formatadores";

function normalizarEspacos(valor: string) {
  return valor.replace(/\u00A0/g, " ").trim();
}

describe("Utils: formatadores (shared)", () => {
  it("Deve formatar valores monetários no padrão brasileiro", () => {
    expect(normalizarEspacos(formatarMoeda(0))).toBe("R$ 0,00");
    expect(normalizarEspacos(formatarMoeda(2.5))).toBe("R$ 2,50");
    expect(normalizarEspacos(formatarMoeda(150))).toBe("R$ 150,00");
  });

  it("Deve tratar valor nulo/undefined como R$ 0,00", () => {
    expect(normalizarEspacos(formatarMoeda(null))).toBe("R$ 0,00");
    expect(normalizarEspacos(formatarMoeda(undefined))).toBe("R$ 0,00");
  });

  it("Deve formatar data no padrão brasileiro", () => {
    const data = "2026-05-10T14:30:00.000Z";

    const resultado = formatarData(data);

    expect(resultado).toMatch(/10\/05\/2026/);
  });

  it("Deve retornar texto padrão quando a data não existir", () => {
    expect(formatarData(null)).toBe("Data não informada");
    expect(formatarData(undefined)).toBe("Data não informada");
  });

  it("Deve retornar texto de data inválida quando a data for inválida", () => {
    expect(formatarData("data-invalida")).toBe("Data inválida");
  });
});
