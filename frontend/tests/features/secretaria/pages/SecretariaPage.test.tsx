// ============================================================================
// ARQUIVO: frontend/tests/secretaria/SecretariaPage.test.tsx
// ============================================================================
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { SecretariaView } from "@/features/secretaria/pages/SecretariaPage";
import { useSecretaria } from "@/features/secretaria/hooks/useSecretaria";

// O mock precisa apontar para o mesmo caminho importado pela página.
vi.mock("@/features/secretaria/hooks/useSecretaria", () => ({
  useSecretaria: vi.fn(),
}));

const mockAderidos = [
  {
    id: "1",
    id_aderido: "ADERIDO_001",
    nome: "Gabriel Silva",
    email: "gabriel@teste.com",
    cargo: "admin",
    status_cadastro: "ativo",
    modalidade_adesao: "completo",
    telefone: "35999999999",
    curso: "ENGENHARIA DE COMPUTAÇÃO",
    cpf: "12345678900",
  },
  {
    id: "2",
    id_aderido: "ADERIDO_002",
    nome: "",
    email: "pendente@teste.com",
    cargo: "aderido",
    status_cadastro: "pendente",
    modalidade_adesao: "meio",
  },
  {
    id: "3",
    id_aderido: "ADERIDO_003",
    nome: "Ana Costa",
    email: "ana@comissao.com",
    cargo: "vice_secretaria",
    status_cadastro: "ativo",
    modalidade_adesao: "completo",
  },
];

describe("Página <SecretariaView />", () => {
  const mockCarregarAderidos = vi.fn();
  const mockAdicionarAderido = vi.fn();
  const mockAtualizarAderido = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSecretaria as any).mockReturnValue({
      aderidos: mockAderidos,
      loading: false,
      carregarAderidos: mockCarregarAderidos.mockResolvedValue(mockAderidos),
      adicionarAderidoIndividual: mockAdicionarAderido.mockResolvedValue({
        idAderido: "ADERIDO_004",
      }),
      atualizarAderidoSecretaria: mockAtualizarAderido.mockResolvedValue({
        sucesso: true,
      }),
    });

    window.alert = vi.fn();
  });

  it("Deve carregar os aderidos ao montar a página", async () => {
    render(<SecretariaView />);

    await waitFor(() => {
      expect(mockCarregarAderidos).toHaveBeenCalledTimes(1);
    });
  });

  it("Deve renderizar a lista de aderidos", () => {
    render(<SecretariaView />);

    expect(screen.getByText("Gabriel Silva")).toBeInTheDocument();
    expect(screen.getByText("pendente@teste.com")).toBeInTheDocument();
    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
  });

  it("Deve exibir os cards de resumo da secretaria", () => {
    render(<SecretariaView />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Aderidos")).toBeInTheDocument();
    expect(screen.getByText("Meio-aderidos")).toBeInTheDocument();
    expect(screen.getByText("Pendentes")).toBeInTheDocument();
    expect(screen.getByText("Comissão")).toBeInTheDocument();
  });

  it("Deve filtrar a lista ao digitar na barra de pesquisa", () => {
    render(<SecretariaView />);

    const inputBusca = screen.getByPlaceholderText(
      /Pesquisar por nome ou e-mail/i,
    );

    fireEvent.change(inputBusca, { target: { value: "Ana" } });

    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    expect(screen.queryByText("Gabriel Silva")).not.toBeInTheDocument();
    expect(screen.queryByText("pendente@teste.com")).not.toBeInTheDocument();
  });

  it("Deve filtrar por modalidade Meio-aderido", () => {
    render(<SecretariaView />);

    expect(screen.getByText("Resultados (3)")).toBeInTheDocument();

    const selectButtons = screen.getAllByRole("combobox");

    // Ordem atual dos filtros: Modalidade, Status, Tipo de usuário.
    fireEvent.mouseDown(selectButtons[0]);

    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Meio-aderido"));

    expect(screen.getByText("Resultados (1)")).toBeInTheDocument();
    expect(screen.getByText("pendente@teste.com")).toBeInTheDocument();
    expect(screen.queryByText("Gabriel Silva")).not.toBeInTheDocument();
    expect(screen.queryByText("Ana Costa")).not.toBeInTheDocument();
  });

  it("Deve filtrar por status Pendente", () => {
    render(<SecretariaView />);

    const selectButtons = screen.getAllByRole("combobox");

    // Ordem atual dos filtros: Modalidade, Status, Tipo de usuário.
    fireEvent.mouseDown(selectButtons[1]);

    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Pendentes"));

    expect(screen.getByText("Resultados (1)")).toBeInTheDocument();
    expect(screen.getByText("pendente@teste.com")).toBeInTheDocument();
    expect(screen.queryByText("Gabriel Silva")).not.toBeInTheDocument();
    expect(screen.queryByText("Ana Costa")).not.toBeInTheDocument();
  });

  it("Deve filtrar por tipo de usuário Comissão", () => {
    render(<SecretariaView />);

    const selectButtons = screen.getAllByRole("combobox");

    // Ordem atual dos filtros: Modalidade, Status, Tipo de usuário.
    fireEvent.mouseDown(selectButtons[2]);

    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Comissão"));

    expect(screen.getByText("Resultados (2)")).toBeInTheDocument();
    expect(screen.getByText("Gabriel Silva")).toBeInTheDocument();
    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    expect(screen.queryByText("pendente@teste.com")).not.toBeInTheDocument();
  });

  it("Deve abrir o modal de Nova Adesão", () => {
    render(<SecretariaView />);

    const botaoNovo = screen.getByRole("button", { name: /Nova Adesão/i });

    fireEvent.click(botaoNovo);

    const modal = screen.getByRole("dialog", { name: /Nova Adesão/i });

    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText("Tipo de cadastro")).toBeInTheDocument();
    expect(
      within(modal).getByLabelText(/E-mail da Keeper/i),
    ).toBeInTheDocument();
  });

  it("Deve abrir o modal de detalhes ao clicar no nome do aderido", () => {
    render(<SecretariaView />);

    fireEvent.click(screen.getByText("Gabriel Silva"));

    const modal = screen.getByRole("dialog", { name: /Dados do Aderido/i });

    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText("gabriel@teste.com")).toBeInTheDocument();
    expect(within(modal).getByText("Editar Dados")).toBeInTheDocument();
  });
});
