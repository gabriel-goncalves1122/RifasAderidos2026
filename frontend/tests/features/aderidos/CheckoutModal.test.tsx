// ============================================================================
// ARQUIVO: frontend/tests/features/aderidos/CheckoutModal.test.tsx
// ============================================================================
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CheckoutModal } from "@/features/aderidos/CheckoutModal";
import { useRifas } from "@/features/rifas/hooks/useRifas";

vi.mock("@/features/rifas/hooks/useRifas", () => ({
  useRifas: vi.fn(),
}));

describe("Componente <CheckoutModal />", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockFinalizarVenda = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRifas as any).mockReturnValue({
      finalizarVenda: mockFinalizarVenda,
      loading: false,
    });
  });

  it("Não deve abrir o dialog quando open for false", () => {
    render(
      <CheckoutModal
        open={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={["001", "002"]}
      />,
    );

    // O Dialog usa keepMounted para preservar estado no Safari/celular.
    // Por isso o conteúdo pode existir no DOM, mas não deve estar aberto como dialog.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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

    const btnSubmit = screen.getByRole("button", {
      name: /finalizar|confirmar|enviar|vender/i,
    });

    fireEvent.click(btnSubmit);

    await waitFor(() => {
      expect(
        screen.getByText(/Informe o nome completo do comprador/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Informe o WhatsApp do comprador/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Anexe o comprovante do PIX/i),
      ).toBeInTheDocument();
    });

    expect(mockFinalizarVenda).not.toHaveBeenCalled();
  });
});
