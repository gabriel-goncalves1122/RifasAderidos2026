// ============================================================================
// ARQUIVO: frontend/tests/aderidos/ModalDetalhesRifa.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ModalDetalhesRifa } from "../../src/views/components/aderidos/ModalDetalhesRifas";

describe("Componente: ModalDetalhesRifa", () => {
  const mockRifa = {
    numero: "050",
    comprador_nome: "Ana Beatriz",
    comprador_telefone: "(11) 98765-4321",
    comprador_email: "ana@email.com",
    data_reserva: "2026-05-10T14:30:00Z",
  };

  it("Não deve renderizar o modal se rifa for null", () => {
    const { container } = render(
      <ModalDetalhesRifa open={true} onClose={vi.fn()} rifa={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("Deve exibir todas as informações da rifa quando aberto", () => {
    render(<ModalDetalhesRifa open={true} onClose={vi.fn()} rifa={mockRifa} />);

    // O Portal teletransporta para o document, portanto verificamos globalmente
    expect(screen.getByText("Detalhes da Rifa #050")).toBeInTheDocument();
    expect(screen.getByText("Aprovada (Paga)")).toBeInTheDocument();
    expect(screen.getByText("Ana Beatriz")).toBeInTheDocument();
    expect(screen.getByText("(11) 98765-4321")).toBeInTheDocument();
    expect(screen.getByText("ana@email.com")).toBeInTheDocument();
  });

  it("Deve fechar o modal ao clicar no botão Fechar", () => {
    const mockOnClose = vi.fn();
    render(
      <ModalDetalhesRifa open={true} onClose={mockOnClose} rifa={mockRifa} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Fechar/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
