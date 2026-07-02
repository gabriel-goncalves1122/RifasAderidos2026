// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/utils/checkoutSchema.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import { checkoutSchema } from "@/features/aderidos/components/checkout/checkoutSchema";

describe("Schema: checkoutSchema", () => {
  it("Deve validar dados corretos do checkout", async () => {
    const dadosValidos = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
      documento: "123.456.789-09",
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
    };

    await expect(checkoutSchema.validate(dadosSemEmail)).resolves.toEqual(
      dadosSemEmail,
    );
  });

  it("Deve aceitar CPF vazio ou ausente", async () => {
    const dadosSemDocumento = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "",
      documento: "",
    };

    await expect(checkoutSchema.validate(dadosSemDocumento)).resolves.toEqual(
      dadosSemDocumento,
    );
  });

  it("Deve rejeitar CPF incompleto", async () => {
    const dadosInvalidos = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      documento: "123.456",
    };

    await expect(checkoutSchema.validate(dadosInvalidos)).rejects.toThrow(
      "CPF incompleto. Use 11 dígitos.",
    );
  });

  it("Não deve exigir comprovante do Pix no fluxo novo", async () => {
    const dadosSemComprovante = {
      nome: "Ana Beatriz",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
    };

    await expect(checkoutSchema.validate(dadosSemComprovante)).resolves.toEqual(
      dadosSemComprovante,
    );
  });

  it("Deve exigir o nome do comprador", async () => {
    const dadosInvalidos = {
      nome: "",
      telefone: "(35) 99999-8888",
      email: "ana@email.com",
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
    };

    await expect(checkoutSchema.validate(dadosInvalidos)).rejects.toThrow(
      "Formato de e-mail inválido.",
    );
  });
});
