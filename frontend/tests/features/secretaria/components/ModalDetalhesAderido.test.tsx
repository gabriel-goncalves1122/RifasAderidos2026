// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/components/ModalDetalhesAderido.test.tsx
// ============================================================================
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ModalDetalhesAderido } from "@/features/secretaria/components/ModalDetalhesAderido";
import { useSecretaria } from "@/features/secretaria/hooks/useSecretaria";
import { AderidoSecretaria } from "@/shared/types/secretaria";

function textoExatoNormalizado(textoEsperado: string) {
  return (_: string, element: Element | null) => {
    const textoElemento = element?.textContent?.replace(/\s+/g, " ").trim();

    return textoElemento === textoEsperado;
  };
}

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
  curso: "ENGENHARIA DA COMPUTAÇÃO",
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

    expect(
      within(modal).getByText(
        textoExatoNormalizado("Gabriel Sampaio • gabriel@teste.com"),
      ),
    ).toBeInTheDocument();

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

  it("Deve bloquear edição de status e modalidade", () => {
    render(
      <ModalDetalhesAderido
        open={true}
        aderido={aderido}
        onClose={mockOnClose}
        onAtualizado={mockOnAtualizado}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Editar Dados/i }));

    expect(screen.getByLabelText("Status")).toBeDisabled();
    expect(screen.getByLabelText("Modalidade")).toBeDisabled();
  });

  it("Deve formatar CPF e telefone durante a edição", () => {
    render(
      <ModalDetalhesAderido
        open={true}
        aderido={{
          ...aderido,
          cpf: "",
          telefone: "",
        }}
        onClose={mockOnClose}
        onAtualizado={mockOnAtualizado}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Editar Dados/i }));

    const cpfInput = screen.getByLabelText("CPF");
    const telefoneInput = screen.getByLabelText("Telefone");

    fireEvent.change(cpfInput, {
      target: { value: "39977937869" },
    });

    fireEvent.change(telefoneInput, {
      target: { value: "19997115858" },
    });

    expect(cpfInput).toHaveValue("399.779.378-69");
    expect(telefoneInput).toHaveValue("(19) 99711-5858");
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
