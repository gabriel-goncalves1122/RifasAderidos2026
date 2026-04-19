// ============================================================================
// ARQUIVO: frontend/tests/aderidos/GrelhasRifas.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GrelhaRifas } from "../../src/views/components/aderidos/GrelhasRifas";

describe("Componente: GrelhaRifas", () => {
  const mockRifas = [
    { numero: "001", status: "disponivel" },
    { numero: "002", status: "pendente" },
    { numero: "003", status: "recusado" },
    { numero: "004", status: "pago" },
  ];

  it("Deve mostrar mensagem de erro caso a lista venha vazia", () => {
    render(
      <GrelhaRifas
        rifas={[]}
        selecionadas={[]}
        onToggleSelecao={vi.fn()}
        onAbrirDetalhes={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/Nenhuma rifa encontrada nesta categoria/i),
    ).toBeInTheDocument();
  });

  it("Deve renderizar os Chips para cada rifa do array", () => {
    render(
      <GrelhaRifas
        rifas={mockRifas}
        selecionadas={["001"]} // A rifa 001 está selecionada
        onToggleSelecao={vi.fn()}
        onAbrirDetalhes={vi.fn()}
      />,
    );

    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("002")).toBeInTheDocument();
    expect(screen.getByText("003")).toBeInTheDocument();
    expect(screen.getByText("004")).toBeInTheDocument();
  });

  it("Deve permitir selecionar APENAS rifas disponíveis", () => {
    const mockToggle = vi.fn();
    render(
      <GrelhaRifas
        rifas={mockRifas}
        selecionadas={[]}
        onToggleSelecao={mockToggle}
        onAbrirDetalhes={vi.fn()}
      />,
    );

    // Clica numa disponível
    fireEvent.click(screen.getByText("001"));
    expect(mockToggle).toHaveBeenCalledWith("001", "disponivel");

    // Clica numa pendente e recusada (não devem acionar o toggle)
    fireEvent.click(screen.getByText("002"));
    fireEvent.click(screen.getByText("003"));

    // O mock só deve ter sido chamado 1 vez (da rifa 001)
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("Deve chamar a função de detalhes APENAS ao clicar em rifas pagas", () => {
    const mockDetalhes = vi.fn();
    render(
      <GrelhaRifas
        rifas={mockRifas}
        selecionadas={[]}
        onToggleSelecao={vi.fn()}
        onAbrirDetalhes={mockDetalhes}
      />,
    );

    // Clica na rifa paga
    fireEvent.click(screen.getByText("004"));

    // O componente deve enviar o objeto INTEIRO da rifa para o modal
    expect(mockDetalhes).toHaveBeenCalledWith({
      numero: "004",
      status: "pago",
    });
  });
});
