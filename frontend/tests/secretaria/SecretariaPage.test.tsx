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
    cargo: "secretaria",
    status_cadastro: "ativo",
  },
];

describe("Página <SecretariaView />", () => {
  const mockInjetarAderidosCSV = vi.fn();
  const mockBuscarAderidos = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Configuramos o mock para devolver as nossas funções simuladas
    (useSecretaria as any).mockReturnValue({
      buscarAderidos: mockBuscarAderidos.mockResolvedValue(mockAderidos),
      injetarAderidosCSV: mockInjetarAderidosCSV.mockResolvedValue(
        "Relatório: 129 aderidos injetados e rifas distribuídas com sucesso!",
      ),
    });

    // 1. PRIMEIRO: Criamos um mock vazio no window
    window.alert = vi.fn();
    // 2. DEPOIS: Agora sim o spyOn vai encontrar uma função!
    vi.spyOn(window, "alert").mockImplementation(() => {});
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

    // Clica na caixa "Categoria"
    const selectButtons = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selectButtons[0]);

    // Clica em "Apenas Comissão" no menu que se abre
    const listbox = within(screen.getByRole("listbox"));
    fireEvent.click(listbox.getByText("Apenas Comissão"));

    // O teste verifica se o pendente desapareceu
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

  // ==========================================================================
  // O NOVO TESTE DO RELATÓRIO DE INJEÇÃO
  // ==========================================================================
  it("Deve enviar o CSV para o Service e mostrar o relatório ao utilizador", async () => {
    // 1. Renderiza o componente
    const { container } = render(<SecretariaView />);
    await waitFor(() =>
      expect(screen.getByText("Gabriel Silva")).toBeInTheDocument(),
    );

    // 2. Simula a criação de um ficheiro CSV de mentira
    const ficheiroSimulado = new File(
      ["coluna1,coluna2\nvalor1,valor2"],
      "aderidos.csv",
      { type: "text/csv" },
    );

    // 3. O nosso componente esconde o <input type="file"> por trás de um botão.
    // Usamos um seletor do HTML (querySelector) para achar o input escondido.
    const inputArquivo = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(inputArquivo).toBeInTheDocument();

    // 4. Simula o utilizador a carregar o ficheiro no input
    fireEvent.change(inputArquivo, { target: { files: [ficheiroSimulado] } });

    // 5. Verifica se o fluxo foi todo cumprido!
    await waitFor(() => {
      // A função do Firebase tem de ser chamada com o ficheiro que mandámos e 120 rifas
      expect(mockInjetarAderidosCSV).toHaveBeenCalledWith(
        ficheiroSimulado,
        120,
      );

      // O Alerta com o relatório tem de aparecer na tela
      expect(window.alert).toHaveBeenCalledWith(
        "Relatório: 129 aderidos injetados e rifas distribuídas com sucesso!",
      );

      // E no fim, a tabela tem de recarregar automaticamente (buscarAderidos é chamado novamente)
      expect(mockBuscarAderidos).toHaveBeenCalledTimes(2); // 1 na montagem + 1 pós-injeção
    });
  });
});
