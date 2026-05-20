// ============================================================================
// ARQUIVO: frontend/tests/secretaria/ModalDetalhesAderido.test.tsx
// ============================================================================
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ModalDetalhesAderido } from "@/features/secretaria/components/ModalDetalhesAderido";
import { useSecretaria } from "@/features/secretaria/hooks/useSecretaria";
import { AderidoSecretaria } from "@/features/secretaria/types/secretaria";

vi.mock("@/features/secretaria/hooks/useSecretaria", () => ({
  useSecretaria: vi.fn(),
}));

const aderido: AderidoSecretaria = {
  id: "ADERIDO_001",
  id_aderido: "ADERIDO_001",
  nome: "Gabriel Sampaio",
  email: "gabriel@teste.com",
  telefone: "35999999999",
  cpf: "12345678900",
  curso: "ENGENHARIA DE COMPUTAÇÃO",
  cargo: "admin",
  status_cadastro: "ativo",
  modalidade_adesao: "completo",
  rifas_vendidas: 10,
  total_arrecadado: 250,
  faixa_rifas: {
    inicio: "0001",
    fim: "0120",
  },
};

describe("Componente <ModalDetalhesAderido />", () => {
  const mockAtualizar = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnAtualizado = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSecretaria as any).mockReturnValue({
      atualizarAderidoSecretaria: mockAtualizar.mockResolvedValue({
        sucesso: true,
      }),
    });
  });

  it("Deve exibir os dados principais do aderido", () => {
    render(
      <ModalDetalhesAderido
        open={true}
        aderido={aderido}
        onClose={mockOnClose}
        onAtualizado={mockOnAtualizado}
      />,
    );

    const modal = screen.getByRole("dialog", { name: /Dados do Aderido/i });

    expect(within(modal).getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(within(modal).getByText("gabriel@teste.com")).toBeInTheDocument();
    // O mesmo valor aparece em ID do documento e ID do aderido.
    expect(within(modal).getAllByText("ADERIDO_001")).toHaveLength(2);
    expect(within(modal).getByText("0001 até 0120")).toBeInTheDocument();
  });

  it("Deve entrar em modo edição ao clicar em Editar Dados", () => {
    render(
      <ModalDetalhesAderido
        open={true}
        aderido={aderido}
        onClose={mockOnClose}
        onAtualizado={mockOnAtualizado}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Editar Dados/i }));

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Salvar alterações/i }),
    ).toBeInTheDocument();
  });

  it("Deve fechar o modal ao clicar em Fechar", () => {
    render(
      <ModalDetalhesAderido
        open={true}
        aderido={aderido}
        onClose={mockOnClose}
        onAtualizado={mockOnAtualizado}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Fechar/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
