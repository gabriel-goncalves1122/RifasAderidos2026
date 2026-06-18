// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/EstatisticasAderido.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { EstatisticasAderido } from "@/features/aderidos/EstatisticasAderido";

describe("Componente <EstatisticasAderido />", () => {
  it("Deve renderizar saudação e arrecadação confirmada", () => {
    render(
      <EstatisticasAderido
        primeiroNome="Gabriel"
        valorArrecadado={250}
        notificacoesNaoLidas={0}
        totalPendencias={0}
        onAbrirNotificacoes={vi.fn()}
        onAbrirRecusadas={vi.fn()}
      />,
    );

    expect(screen.getByText(/Olá, Gabriel/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Confirmado nas vendas aprovadas/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*250,00/i)).toBeInTheDocument();
    expect(screen.getByText(/Sem pendências/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mapa de rifas/i)).not.toBeInTheDocument();
  });

  it("Deve abrir notificações ao clicar no botão de avisos", () => {
    const mockAbrirNotificacoes = vi.fn();

    render(
      <EstatisticasAderido
        primeiroNome="Gabriel"
        valorArrecadado={0}
        notificacoesNaoLidas={2}
        totalPendencias={0}
        onAbrirNotificacoes={mockAbrirNotificacoes}
        onAbrirRecusadas={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Abrir notificações/i,
      }),
    );

    expect(mockAbrirNotificacoes).toHaveBeenCalledTimes(1);
  });

  it("Deve mostrar pendências e permitir abrir correções", () => {
    const mockAbrirRecusadas = vi.fn();

    render(
      <EstatisticasAderido
        primeiroNome="Gabriel"
        valorArrecadado={0}
        notificacoesNaoLidas={0}
        totalPendencias={1}
        onAbrirNotificacoes={vi.fn()}
        onAbrirRecusadas={mockAbrirRecusadas}
      />,
    );

    expect(screen.getByText(/Vendas recusadas/i)).toBeInTheDocument();
    expect(screen.getByText(/Corrigir dados/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Vendas recusadas/i }));

    expect(mockAbrirRecusadas).toHaveBeenCalledTimes(1);
  });
});
