// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/GrelhaRifas.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { GrelhaRifas } from "@/features/aderidos/components/GrelhaRifas";

const rifas = [
  {
    numero: "001",
    status: "disponivel",
  },
  {
    numero: "002",
    status: "pago",
    comprador_nome: "Ana Beatriz",
  },
  {
    numero: "003",
    status: "pendente",
  },
  {
    numero: "004",
    status: "recusado",
  },
];

describe("Componente <GrelhaRifas />", () => {
  it("Deve mostrar estado vazio quando não houver rifas", () => {
    render(
      <GrelhaRifas
        rifas={[]}
        selecionadas={[]}
        onToggleSelecao={vi.fn()}
        onAbrirDetalhes={vi.fn()}
      />,
    );

    expect(screen.getByText(/Nenhuma rifa encontrada/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Ajuste o filtro para visualizar outras categorias/i),
    ).toBeInTheDocument();
  });

  it("Deve renderizar os números das rifas", () => {
    render(
      <GrelhaRifas
        rifas={rifas}
        selecionadas={[]}
        onToggleSelecao={vi.fn()}
        onAbrirDetalhes={vi.fn()}
      />,
    );

    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("002")).toBeInTheDocument();
    expect(screen.getByText("003")).toBeInTheDocument();
    expect(screen.getByText("004")).toBeInTheDocument();
  });

  it("Deve permitir selecionar apenas rifas disponíveis", () => {
    const mockToggle = vi.fn();

    render(
      <GrelhaRifas
        rifas={rifas}
        selecionadas={[]}
        onToggleSelecao={mockToggle}
        onAbrirDetalhes={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("001"));
    fireEvent.click(screen.getByText("003"));
    fireEvent.click(screen.getByText("004"));

    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledWith("001", "disponivel");
  });

  it("Deve abrir detalhes apenas ao clicar em rifa paga", () => {
    const mockDetalhes = vi.fn();

    render(
      <GrelhaRifas
        rifas={rifas}
        selecionadas={[]}
        onToggleSelecao={vi.fn()}
        onAbrirDetalhes={mockDetalhes}
      />,
    );

    fireEvent.click(screen.getByText("002"));
    fireEvent.click(screen.getByText("003"));

    expect(mockDetalhes).toHaveBeenCalledTimes(1);
    expect(mockDetalhes).toHaveBeenCalledWith(
      expect.objectContaining({
        numero: "002",
        status: "pago",
      }),
    );
  });
});
