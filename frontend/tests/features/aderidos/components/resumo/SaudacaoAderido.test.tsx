// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/SaudacaoAderido.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SaudacaoAderido } from "@/features/aderidos/components/resumo/SaudacaoAderido";

describe("Componente: SaudacaoAderido", () => {
  it("Deve renderizar a saudação com o primeiro nome informado", () => {
    render(<SaudacaoAderido primeiroNome="Gabriel" />);

    expect(
      screen.getByRole("heading", {
        name: /olá, gabriel/i,
      }),
    ).toBeInTheDocument();
  });

  it("Deve usar Aderido quando o nome vier vazio", () => {
    render(<SaudacaoAderido primeiroNome="" />);

    expect(
      screen.getByRole("heading", {
        name: /olá, aderido/i,
      }),
    ).toBeInTheDocument();
  });

  it("Deve usar Aderido quando o nome vier apenas com espaços", () => {
    render(<SaudacaoAderido primeiroNome="     " />);

    expect(
      screen.getByRole("heading", {
        name: /olá, aderido/i,
      }),
    ).toBeInTheDocument();
  });
});
