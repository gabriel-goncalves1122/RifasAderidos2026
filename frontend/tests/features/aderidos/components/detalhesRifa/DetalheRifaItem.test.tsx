// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/DetalheRifaItem.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createElement } from "react";

import { DetalheRifaItem } from "@/features/aderidos/components/detalhesRifa/DetalheRifaItem";

function renderDetalheRifaItem(props: Record<string, unknown>) {
  return render(createElement(DetalheRifaItem as any, props));
}

describe("Componente: DetalheRifaItem", () => {
  it("Deve renderizar o rótulo e o valor do detalhe", () => {
    renderDetalheRifaItem({
      label: "Comprador",
      titulo: "Comprador",
      rotulo: "Comprador",
      valor: "Ana Beatriz",
      value: "Ana Beatriz",
    });

    expect(screen.getByText("Comprador")).toBeInTheDocument();
    expect(screen.getByText("Ana Beatriz")).toBeInTheDocument();
  });

  it("Deve renderizar valor de fallback quando o valor estiver vazio", () => {
    renderDetalheRifaItem({
      label: "Telefone",
      titulo: "Telefone",
      rotulo: "Telefone",
      valor: "",
      value: "",
      fallback: "Não informado",
    });

    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText(/não informado/i)).toBeInTheDocument();
  });

  it("Deve aceitar valor numérico como conteúdo", () => {
    renderDetalheRifaItem({
      label: "Número",
      titulo: "Número",
      rotulo: "Número",
      valor: 25,
      value: 25,
    });

    expect(screen.getByText("Número")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });
});
