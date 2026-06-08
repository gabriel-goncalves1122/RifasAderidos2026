// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/checkoutUtils.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import {
  aplicarMascaraTelefone,
  calcularValorTotalRifas,
  formatarExpiracaoPix,
} from "@/features/aderidos/components/checkout/utils/checkoutUtils";

describe("Utils: checkoutUtils", () => {
  it("Deve calcular o valor total das rifas considerando R$ 10,00 por rifa", () => {
    expect(calcularValorTotalRifas([])).toBe(0);
    expect(calcularValorTotalRifas(["001"])).toBe(10);
    expect(calcularValorTotalRifas(["001", "002", "003"])).toBe(30);
  });

  it("Deve aplicar máscara para telefone celular com 11 dígitos", () => {
    expect(aplicarMascaraTelefone("11987654321")).toBe("(11) 98765-4321");
  });

  it("Deve aplicar máscara progressiva para telefone incompleto", () => {
    expect(aplicarMascaraTelefone("35")).toBe("35");
    expect(aplicarMascaraTelefone("359")).toBe("(35) 9");
    expect(aplicarMascaraTelefone("3599999")).toBe("(35) 99999");
  });

  it("Deve remover caracteres não numéricos antes de aplicar a máscara", () => {
    expect(aplicarMascaraTelefone("(35) 99999-8888")).toBe("(35) 99999-8888");
    expect(aplicarMascaraTelefone("35abc99999xx8888")).toBe("(35) 99999-8888");
  });

  it("Deve limitar o telefone ao tamanho máximo da máscara", () => {
    expect(aplicarMascaraTelefone("119876543219999")).toBe("(11) 98765-4321");
  });

  it("Deve formatar a expiração do pagamento via Pix", () => {
    expect(formatarExpiracaoPix("2026-06-07T18:00:00.000-03:00")).toContain(
      "07/06/2026",
    );
  });

  it("Deve tratar expiração ausente ou inválida", () => {
    expect(formatarExpiracaoPix()).toBe("Expiração não informada");
    expect(formatarExpiracaoPix("data-invalida")).toBe("Expiração inválida");
  });
});
