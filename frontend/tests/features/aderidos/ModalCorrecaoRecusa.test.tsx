// ============================================================================
// ARQUIVO: frontend/tests/aderidos/ModalCorrecaoRecusa.test.tsx
// ============================================================================
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ModalCorrecaoRecusa } from "@/features/aderidos/ModalCorrecaoRecusa";

describe("Componente: ModalCorrecaoRecusa", () => {
  const mockOnClose = vi.fn();
  const mockOnCorrigirDados = vi.fn().mockResolvedValue(true);

  const mockGrupoRecusado = {
    comprador: "João Silva",
    email: "joao@email.com",
    telefone: "11987654321",
    motivo: "Telefone do comprador divergente.",
    bilhetes: ["015", "016"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnCorrigirDados.mockResolvedValue(true);
  });

  it("Não deve renderizar nada se o grupoRecusado for nulo", () => {
    const { container } = render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={null}
        onCorrigirDados={mockOnCorrigirDados}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Deve renderizar os dados iniciais e aplicar máscara ao telefone", () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={mockGrupoRecusado}
        onCorrigirDados={mockOnCorrigirDados}
      />,
    );

    expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    expect(screen.getByDisplayValue("joao@email.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("(11) 98765-4321")).toBeInTheDocument();
    expect(
      screen.getByText(/Telefone do comprador divergente/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Confira DDD e número do WhatsApp/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Por que foi recusada/i)).toBeInTheDocument();
    expect(screen.getByText(/015, 016/i)).toBeInTheDocument();
    expect(screen.queryByText(/Anexar/i)).not.toBeInTheDocument();
  });

  it("Deve aplicar a formatação do telefone enquanto o usuário digita", () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={{ ...mockGrupoRecusado, telefone: "" }}
        onCorrigirDados={mockOnCorrigirDados}
      />,
    );

    const inputTelefone = screen.getByLabelText(
      /Telefone do Comprador/i,
    ) as HTMLInputElement;

    fireEvent.change(inputTelefone, { target: { value: "21912345678" } });

    expect(inputTelefone.value).toBe("(21) 91234-5678");
  });

  it("Deve manter o botão desativado quando faltar nome ou telefone", () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={{
          ...mockGrupoRecusado,
          comprador: "",
          telefone: "",
        }}
        onCorrigirDados={mockOnCorrigirDados}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Corrigir e Reenviar/i }),
    ).toBeDisabled();
  });

  it("Deve exigir confirmação dos dados antes de reenviar", () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={mockGrupoRecusado}
        onCorrigirDados={mockOnCorrigirDados}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Corrigir e Reenviar/i }),
    ).toBeDisabled();

    fireEvent.click(screen.getByLabelText(/Verifiquei os dados/i));

    expect(
      screen.getByRole("button", { name: /Corrigir e Reenviar/i }),
    ).not.toBeDisabled();
  });

  it("Deve submeter somente os dados corrigidos", async () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={mockGrupoRecusado}
        onCorrigirDados={mockOnCorrigirDados}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Verifiquei os dados/i));
    fireEvent.click(
      screen.getByRole("button", { name: /Corrigir e Reenviar/i }),
    );

    await waitFor(() => {
      expect(mockOnCorrigirDados).toHaveBeenCalledWith(["015", "016"], {
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(11) 98765-4321",
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("Deve exibir erro quando a correção estiver indisponível", async () => {
    mockOnCorrigirDados.mockResolvedValueOnce(false);

    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={mockGrupoRecusado}
        onCorrigirDados={mockOnCorrigirDados}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Verifiquei os dados/i));
    fireEvent.click(
      screen.getByRole("button", { name: /Corrigir e Reenviar/i }),
    );

    expect(
      await screen.findByText(/Correção de dados indisponível/i),
    ).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
