import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CheckoutModal } from "../src/views/components/aderidos/CheckoutModal";
import { useRifas } from "../src/controllers/useRifas";

// Mock do Controlador de Rifas
vi.mock("../src/controllers/useRifas", () => ({
  useRifas: vi.fn(),
}));

describe("Componente <CheckoutModal />", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockFinalizarVenda = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // CORREÇÃO: Usamos diretamente o cast (as any)
    (useRifas as any).mockReturnValue({
      finalizarVenda: mockFinalizarVenda,
      loading: false,
    });
  });

  it("Não deve renderizar o modal se 'open' for false", () => {
    render(
      <CheckoutModal
        open={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={["001", "002"]}
      />,
    );
    expect(screen.queryByText(/Finalizar Venda/i)).not.toBeInTheDocument();
  });

  it("Deve calcular corretamente o valor total do PIX na tela", () => {
    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={["001", "002"]}
      />,
    );

    // 2 rifas = 20 reais. Verifica se o texto apareceu.
    expect(screen.getByText(/20,00/i)).toBeInTheDocument();
  });

  it("Deve mostrar erro de validação se tentar submeter sem preencher", async () => {
    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={["001"]}
      />,
    );

    const btnSubmit = screen.getByRole("button", { name: /Confirmar Venda/i });
    fireEvent.click(btnSubmit);

    // O Yup deve reclamar do Nome e do Telefone
    await waitFor(() => {
      expect(
        screen.getByText(/O nome completo é obrigatório/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/O WhatsApp é obrigatório/i)).toBeInTheDocument();
    });

    // A função do backend NÃO deve ser chamada se o form for inválido
    expect(mockFinalizarVenda).not.toHaveBeenCalled();
  });
});
