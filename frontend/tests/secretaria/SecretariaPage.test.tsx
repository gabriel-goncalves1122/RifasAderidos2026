import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SecretariaView } from "../../src/views/pages/SecretariaPage";
import { useSecretaria } from "../../src/controllers/useSecretaria";

// MOCK DO CONTROLLER
vi.mock("../../src/controllers/useSecretaria", () => ({
  useSecretaria: vi.fn(),
}));

const mockAderidos = [
  {
    id: "1",
    nome: "Gabriel Silva",
    email: "gabriel@teste.com",
    cargo: "admin",
    status_cadastro: "ativo",
  },
  {
    id: "2",
    nome: "",
    email: "pendente@teste.com",
    cargo: "aderido",
    status_cadastro: "pendente",
  },
  {
    id: "3",
    nome: "Ana Costa",
    email: "ana@comissao.com",
    cargo: "vice_secretaria",
    status_cadastro: "ativo",
  },
];

describe("Página <SecretariaView />", () => {
  const mockBuscarAderidos = vi.fn();
  const mockAdicionarAderido = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useSecretaria as any).mockReturnValue({
      buscarAderidos: mockBuscarAderidos.mockResolvedValue(mockAderidos),
      adicionarAderidoIndividual: mockAdicionarAderido.mockResolvedValue({
        idAderido: "ADERIDO_004",
      }),
    });

    window.alert = vi.fn();
  });

  it("Deve renderizar a lista de aderidos após o carregamento", async () => {
    render(<SecretariaView />);
    await waitFor(() => {
      expect(screen.getByText("Gabriel Silva")).toBeInTheDocument();
      expect(screen.getByText("pendente@teste.com")).toBeInTheDocument();
      expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    });
  });

  it("Deve filtrar a lista ao digitar na barra de pesquisa", async () => {
    render(<SecretariaView />);
    await waitFor(() =>
      expect(screen.getByText("Gabriel Silva")).toBeInTheDocument(),
    );

    const inputBusca = screen.getByPlaceholderText(
      /Pesquisar por nome ou e-mail/i,
    );
    fireEvent.change(inputBusca, { target: { value: "Ana" } });

    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    expect(screen.queryByText("Gabriel Silva")).not.toBeInTheDocument();
  });

  it("Deve filtrar por Categoria (Apenas Comissão)", async () => {
    render(<SecretariaView />);
    await waitFor(() =>
      expect(screen.getByText("Resultados (3)")).toBeInTheDocument(),
    );

    const selectButtons = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selectButtons[0]); // Primeiro Select = Categoria

    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Só Comissão"));

    // Gabriel e Ana são comissão, pendente não.
    expect(screen.getByText("Resultados (2)")).toBeInTheDocument();
    expect(screen.queryByText("pendente@teste.com")).not.toBeInTheDocument();
  });

  it("Deve abrir o Modal ao clicar no botão de Novo Membro", async () => {
    render(<SecretariaView />);
    await waitFor(() =>
      expect(screen.getByText("Gabriel Silva")).toBeInTheDocument(),
    );

    const botaoNovo = screen.getByRole("button", { name: /Novo Membro/i });
    fireEvent.click(botaoNovo);

    // Verifica se o texto do Modal aparece no ecrã
    expect(screen.getByText("Autorizar Novo Aderido")).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail da Keeper/i)).toBeInTheDocument();
  });
});
