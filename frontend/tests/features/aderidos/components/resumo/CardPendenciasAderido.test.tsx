// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/CardPendenciasAderido.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CardPendenciasAderido } from "@/features/aderidos/components/resumo/CardPendenciasAderido";

describe("Componente <CardPendenciasAderido />", () => {
  it("Deve mostrar estado sem pendências quando totalPendencias for zero", () => {
    render(
      <CardPendenciasAderido totalPendencias={0} onAbrirRecusadas={vi.fn()} />,
    );

    expect(screen.getByText(/Sem pendências/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Vendas recusadas/i }),
    ).not.toBeInTheDocument();
  });

  it("Deve mostrar aviso quando houver uma pendência", () => {
    render(
      <CardPendenciasAderido totalPendencias={1} onAbrirRecusadas={vi.fn()} />,
    );

    expect(screen.getByText(/Vendas recusadas/i)).toBeInTheDocument();
    expect(screen.getByText(/Corrigir dados/i)).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Vendas recusadas/i })).toBeInTheDocument();
  });

  it("Deve chamar onAbrirRecusadas ao clicar em Vendas recusadas", () => {
    const mockOnAbrirRecusadas = vi.fn();

    render(
      <CardPendenciasAderido
        totalPendencias={2}
        onAbrirRecusadas={mockOnAbrirRecusadas}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Vendas recusadas/i }));

    expect(mockOnAbrirRecusadas).toHaveBeenCalledTimes(1);
  });

  it("Deve exibir quantidade plural de pendências", () => {
    render(
      <CardPendenciasAderido totalPendencias={3} onAbrirRecusadas={vi.fn()} />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
