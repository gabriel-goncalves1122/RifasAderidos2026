// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/obterPrimeiroNomeAderido.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import { obterPrimeiroNomeAderido } from "@/features/aderidos/utils/obterPrimeiroNomeAderido";

describe("Utils: obterPrimeiroNomeAderido", () => {
  it("Deve retornar o primeiro nome a partir do nome completo", () => {
    const resultado = obterPrimeiroNomeAderido({
      nome: "Gabriel Sampaio",
      displayName: "Outro Nome",
      email: "gabriel@email.com",
    });

    expect(resultado).toBe("Gabriel");
  });

  it("Deve usar displayName quando nome não estiver disponível", () => {
    const resultado = obterPrimeiroNomeAderido({
      nome: "",
      displayName: "Ana Beatriz Costa",
      email: "ana@email.com",
    });

    expect(resultado).toBe("Ana");
  });

  it("Deve usar a parte antes do @ quando só houver e-mail", () => {
    const resultado = obterPrimeiroNomeAderido({
      nome: undefined,
      displayName: undefined,
      email: "joao.silva@email.com",
    });

    expect(resultado).toBe("joao.silva");
  });

  it("Deve remover espaços extras antes de extrair o primeiro nome", () => {
    const resultado = obterPrimeiroNomeAderido({
      nome: "   Maria   Oliveira   ",
      displayName: "",
      email: "",
    });

    expect(resultado).toBe("Maria");
  });

  it("Deve retornar Aderido quando nenhum dado estiver disponível", () => {
    const resultado = obterPrimeiroNomeAderido({
      nome: "",
      displayName: "",
      email: "",
    });

    expect(resultado).toBe("Aderido");
  });
});
