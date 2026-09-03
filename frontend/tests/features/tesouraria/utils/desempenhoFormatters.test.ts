import { describe, expect, it } from "vitest";

import {
  formatarMoedaDesempenho,
  formatarInteiroDesempenho,
  formatarValorEixoDesempenho,
} from "@/features/tesouraria/utils/desempenhoFormatters";

describe("Utils: desempenhoFormatters", () => {
  it("Deve formatar moeda corretamente", () => {
    expect(formatarMoedaDesempenho(1000)).toMatch(/R\$\s*1\.000,00/);
    expect(formatarMoedaDesempenho(undefined)).toMatch(/R\$\s*0,00/);
  });

  it("Deve formatar inteiro corretamente com fallbacks", () => {
    expect(formatarInteiroDesempenho(1500)).toBe("1.500");
    expect(formatarInteiroDesempenho(undefined)).toBe("0");
    expect(formatarInteiroDesempenho(null)).toBe("0");
    expect(formatarInteiroDesempenho(0)).toBe("0");
  });

  it("Deve formatar eixo do gráfico de desempenho", () => {
    expect(formatarValorEixoDesempenho(500)).toBe("R$ 500");
    expect(formatarValorEixoDesempenho(1000)).toBe("R$ 1 mil");
    expect(formatarValorEixoDesempenho(2500)).toBe("R$ 3 mil"); // Math.round(2500/1000) = 3
    expect(formatarValorEixoDesempenho(1500)).toBe("R$ 2 mil"); // Math.round(1500/1000) = 2
  });
});
