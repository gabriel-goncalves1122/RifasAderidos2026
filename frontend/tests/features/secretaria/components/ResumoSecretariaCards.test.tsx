// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/components/ResumoSecretariaCards.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createElement } from "react";

import { ResumoSecretariaCards } from "@/features/secretaria/components/ResumoSecretariaCards";

function renderResumoSecretariaCards(overrides: Record<string, unknown> = {}) {
  const props = {
    resumo: {
      total: 10,
      aderidos: 6,
      meioAderidos: 4,
      pendentes: 2,
      comissao: 3,
    },
    total: 10,
    aderidos: 6,
    meioAderidos: 4,
    pendentes: 2,
    comissao: 3,
    ...overrides,
  };

  render(createElement(ResumoSecretariaCards as any, props));

  return props;
}

describe("Componente: ResumoSecretariaCards", () => {
  it("Deve renderizar os rótulos dos cards de resumo", () => {
    renderResumoSecretariaCards();

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Aderidos")).toBeInTheDocument();
    expect(screen.getByText("Meio-aderidos")).toBeInTheDocument();
    expect(screen.getByText("Pendentes")).toBeInTheDocument();
    expect(screen.getByText("Comissão")).toBeInTheDocument();
  });

  it("Deve exibir quantidade total", () => {
    renderResumoSecretariaCards();

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("Deve exibir quantidade de meio-aderidos", () => {
    renderResumoSecretariaCards();

    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("Deve exibir quantidade de pendentes", () => {
    renderResumoSecretariaCards();

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("Deve exibir quantidade de membros da comissão", () => {
    renderResumoSecretariaCards();

    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
