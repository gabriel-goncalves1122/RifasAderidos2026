// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/checkoutSchema.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import { checkoutSchema } from "@/features/aderidos/components/checkout/checkoutSchema";

function criarArquivoTeste() {
  return new File(["comprovante"], "comprovante.png", {
    type: "image/png",
  });
}

describe("Schema: checkoutSchema", () => {
  it("Deve validar dados corretos do checkout", async () => {
    const dadosValidos = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
      comprovante: criarArquivoTeste(),
    };

    await expect(checkoutSchema.validate(dadosValidos)).resolves.toEqual(
      dadosValidos,
    );
  });

  it("Deve aceitar e-mail vazio ou ausente", async () => {
    const dadosSemEmail = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "",
      comprovante: criarArquivoTeste(),
    };

    await expect(checkoutSchema.validate(dadosSemEmail)).resolves.toEqual(
      dadosSemEmail,
    );
  });

  it("Deve exigir o nome do comprador", async () => {
    const dadosInvalidos = {
      nome: "",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
      comprovante: criarArquivoTeste(),
    };

    await expect(checkoutSchema.validate(dadosInvalidos)).rejects.toThrow(
      "Informe o nome completo do comprador.",
    );
  });

  it("Deve exigir o WhatsApp do comprador", async () => {
    const dadosInvalidos = {
      nome: "Ana Beatriz",
      telefone: "",
      email: "ana@email.com",
      comprovante: criarArquivoTeste(),
    };

    await expect(checkoutSchema.validate(dadosInvalidos)).rejects.toThrow(
      "Informe o WhatsApp do comprador.",
    );
  });

  it("Deve rejeitar telefone incompleto", async () => {
    const dadosInvalidos = {
      nome: "Ana Beatriz",
      telefone: "(35) 9999",
      email: "ana@email.com",
      comprovante: criarArquivoTeste(),
    };

    await expect(checkoutSchema.validate(dadosInvalidos)).rejects.toThrow(
      "Telefone incompleto. Use o formato (35) 99999-9999.",
    );
  });

  it("Deve rejeitar e-mail inválido", async () => {
    const dadosInvalidos = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "email-invalido",
      comprovante: criarArquivoTeste(),
    };

    await expect(checkoutSchema.validate(dadosInvalidos)).rejects.toThrow(
      "Formato de e-mail inválido.",
    );
  });

  it("Deve exigir comprovante do PIX", async () => {
    const dadosInvalidos = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
      comprovante: undefined,
    };

    await expect(checkoutSchema.validate(dadosInvalidos)).rejects.toThrow(
      "Anexe o comprovante do PIX para finalizar a venda.",
    );
  });
});
