// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/components/ResumoSecretariaCards.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResumoSecretariaCards } from "@/features/secretaria/components/shared/ResumoSecretariaCards";

function renderResumoSecretariaCards(overrides: Record<string, unknown> = {}) {
  const props = {
    resumo: {
      total: 10,
      aderidos: 6,
      meioAderidos: 4,
      pendentes: 2,
      comissao: 3,
      ...overrides,
    },
  };

  render(<ResumoSecretariaCards {...props} />);

  return props;
}

describe("Componente: ResumoSecretariaCards", () => {
  it("Deve renderizar os rótulos dos cards de resumo", () => {
    renderResumoSecretariaCards();

    expect(screen.getByRole("article", { name: "Resumo Total" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Resumo Aderidos" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Resumo Meio-aderidos" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Resumo Pendentes" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Resumo Comissão" })).toBeInTheDocument();
  });

  it("Deve renderizar descrições curtas nos cards", () => {
    renderResumoSecretariaCards();

    expect(screen.getByText("No painel")).toBeInTheDocument();
    expect(screen.getByText("Completos")).toBeInTheDocument();
    expect(screen.getByText("A revisar")).toBeInTheDocument();
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
