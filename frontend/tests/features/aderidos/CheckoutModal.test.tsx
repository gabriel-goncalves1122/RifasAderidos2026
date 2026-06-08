// ============================================================================
// ARQUIVO: frontend/tests/features/aderidos/CheckoutModal.test.tsx
// ============================================================================
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CheckoutModal } from "@/features/aderidos/CheckoutModal";
import { checkoutPixService } from "@/features/aderidos/services/checkoutPixService";
import { painelAderidoStyles } from "@/features/aderidos/styles/painelAderidoStyles";

vi.mock("@/features/aderidos/services/checkoutPixService", () => ({
  checkoutPixService: {
    criarCobrancaPix: vi.fn(),
  },
}));

describe("Componente <CheckoutModal />", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
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

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Deve calcular corretamente o valor total do Pix na tela", () => {
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

  it("Deve compartilhar o PaperProps visual com modal de detalhes", () => {
    expect(painelAderidoStyles.detalheDialogPaper).toMatchObject({
      bgcolor: "#F6F8F7",
      overflow: "hidden",
    });
  });

  it("Deve mostrar erro de validação sem exigir comprovante", async () => {
    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={["001"]}
      />,
    );

    expect(screen.getByText(/Etapa 1 de 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Preencher dados/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /gerar pagamento/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Informe o nome completo do comprador/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Informe o WhatsApp do comprador/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/Anexe o comprovante do PIX/i),
    ).not.toBeInTheDocument();
    expect(checkoutPixService.criarCobrancaPix).not.toHaveBeenCalled();
  });

  it("Deve gerar pagamento via Pix pelo backend do sistema", async () => {
    vi.mocked(checkoutPixService.criarCobrancaPix).mockResolvedValueOnce({
      id: "pix_001",
      status: "aguardando_pagamento",
      qrCodeBase64: "base64-qr-code",
      copiaECola: "000201PIXTESTE",
      expiraEm: "2026-06-07T18:00:00.000-03:00",
    });

    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={["001", "002"]}
      />,
    );

    fireEvent.change(screen.getByTestId("checkout-nome"), {
      target: { value: "Ana Beatriz" },
    });
    fireEvent.change(screen.getByTestId("checkout-telefone"), {
      target: { value: "35999998888" },
    });
    fireEvent.change(screen.getByTestId("checkout-email"), {
      target: { value: "ana@email.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /gerar pagamento/i }));

    await waitFor(() => {
      expect(checkoutPixService.criarCobrancaPix).toHaveBeenCalledWith({
        nome: "Ana Beatriz",
        telefone: "(35) 99999-8888",
        email: "ana@email.com",
        numerosRifas: ["001", "002"],
      });
    });

    expect(await screen.findByText("000201PIXTESTE")).toBeInTheDocument();
    expect(screen.getByAltText("QR Code Pix")).toBeInTheDocument();
    expect(screen.getByText(/Etapa 2 de 2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pagamento gerado/i)).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /abrir app de banco/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /pagamento gerado/i }),
    ).toBeDisabled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("Deve mostrar indisponibilidade quando o endpoint futuro ainda não responder", async () => {
    vi.mocked(checkoutPixService.criarCobrancaPix).mockRejectedValueOnce(
      new Error("Erro HTTP 404"),
    );

    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={["001"]}
      />,
    );

    fireEvent.change(screen.getByTestId("checkout-nome"), {
      target: { value: "Ana Beatriz" },
    });
    fireEvent.change(screen.getByTestId("checkout-telefone"), {
      target: { value: "35999998888" },
    });

    fireEvent.click(screen.getByRole("button", { name: /gerar pagamento/i }));

    expect(
      await screen.findByText(/Pagamento via Pix indisponível no momento/i),
    ).toBeInTheDocument();
  });
});
