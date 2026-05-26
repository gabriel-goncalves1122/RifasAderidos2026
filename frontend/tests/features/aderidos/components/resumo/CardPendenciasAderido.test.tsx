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

    expect(screen.getByText(/Pendências/i)).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(
      screen.getByText(/Nenhuma correção no momento/i),
    ).toBeInTheDocument();
  });

  it("Deve mostrar aviso quando houver uma pendência", () => {
    render(
      <CardPendenciasAderido totalPendencias={1} onAbrirRecusadas={vi.fn()} />,
    );

    expect(
      screen.getByText(/1 correção pendente/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Corrigir/i }),
    ).toBeInTheDocument();
  });

  it("Deve chamar onAbrirRecusadas ao clicar em Corrigir", () => {
    const mockOnAbrirRecusadas = vi.fn();

    render(
      <CardPendenciasAderido
        totalPendencias={2}
        onAbrirRecusadas={mockOnAbrirRecusadas}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Corrigir/i }));

    expect(mockOnAbrirRecusadas).toHaveBeenCalledTimes(1);
  });

  it("Deve exibir quantidade plural de pendências", () => {
    render(
      <CardPendenciasAderido totalPendencias={3} onAbrirRecusadas={vi.fn()} />,
    );

    expect(
      screen.getByText(/3 correções pendentes/i),
    ).toBeInTheDocument();
  });
});
