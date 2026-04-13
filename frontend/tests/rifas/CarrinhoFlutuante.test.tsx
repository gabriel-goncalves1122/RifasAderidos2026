// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/CarrinhoFlutuante.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CarrinhoFlutuante } from "../../src/views/components/aderidos/CarrinhoFlutuante";

describe("Componente <CarrinhoFlutuante />", () => {
  const mockOnVenderClick = vi.fn();

  it("Não deve renderizar ABSOLUTAMENTE NADA se a quantidade for 0", () => {
    render(
      <CarrinhoFlutuante
        quantidade={0}
        valorTotal={0}
        onVenderClick={mockOnVenderClick}
      />,
    );

    // Procura por qualquer texto do carrinho, não deve existir
    expect(
      screen.queryByText(/rifa\(s\) selecionada\(s\)/i),
    ).not.toBeInTheDocument();
  });

  it("Deve aparecer com a quantidade e o valor corretos quando houver rifas", () => {
    render(
      <CarrinhoFlutuante
        quantidade={3}
        valorTotal={30}
        onVenderClick={mockOnVenderClick}
      />,
    );

    expect(screen.getByText("3 rifa(s) selecionada(s)")).toBeInTheDocument();
    expect(screen.getByText("R$ 30,00")).toBeInTheDocument();
  });

  it("Deve disparar a função de Vender ao clicar no botão", () => {
    render(
      <CarrinhoFlutuante
        quantidade={2}
        valorTotal={20}
        onVenderClick={mockOnVenderClick}
      />,
    );

    const btnVender = screen.getByRole("button", { name: /vender/i });
    fireEvent.click(btnVender);

    expect(mockOnVenderClick).toHaveBeenCalledTimes(1);
  });
});
