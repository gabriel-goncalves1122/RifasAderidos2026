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

import { SecretariaView } from "../../src/views/pages/SecretariaPage";
import { useSecretaria } from "../../src/controllers/useSecretaria";

// 1. O MOCK AGORA TEM O CAMINHO EXATO DO IMPORT ACIMA
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
    cargo: "secretaria",
    status_cadastro: "ativo",
  },
];

describe("Página <SecretariaView />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSecretaria as any).mockReturnValue({
      buscarAderidos: vi.fn().mockResolvedValue(mockAderidos),
    });
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
    fireEvent.change(inputBusca, { target: { value: "Gabriel" } });

    expect(screen.getByText("Gabriel Silva")).toBeInTheDocument();
    expect(screen.queryByText("Ana Costa")).not.toBeInTheDocument();
  });

  it("Deve filtrar por Categoria (Apenas Comissão)", async () => {
    render(<SecretariaView />);

    await waitFor(() =>
      expect(
        screen.getByText("Resultados Encontrados (3)"),
      ).toBeInTheDocument(),
    );

    // Truque para o MUI: Procurar pelo botão que abre o menu suspenso do Select de Categoria
    // Como temos dois selects (Categoria e Status), pegamos o primeiro (índice 0)
    const selectButtons = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selectButtons[0]); // Clica na caixa "Categoria"

    // Agora o menu flutuante está aberto, podemos procurar a opção e clicar nela
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Apenas Comissão"));

    // O teste verifica se a lista atualizou
    expect(screen.getByText("Resultados Encontrados (2)")).toBeInTheDocument();
    expect(screen.queryByText("pendente@teste.com")).not.toBeInTheDocument();
  });

  it("Deve mostrar mensagem amigável quando nenhum resultado for encontrado", async () => {
    render(<SecretariaView />);

    await waitFor(() =>
      expect(screen.getByText("Gabriel Silva")).toBeInTheDocument(),
    );

    const inputBusca = screen.getByPlaceholderText(
      /Pesquisar por nome ou e-mail/i,
    );
    fireEvent.change(inputBusca, { target: { value: "UsuarioInexistente" } });

    expect(
      screen.getByText("Nenhum resultado encontrado."),
    ).toBeInTheDocument();
  });
});
