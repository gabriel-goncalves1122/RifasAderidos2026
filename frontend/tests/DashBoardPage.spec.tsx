import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { DashboardPage } from "../src/views/pages/DashboardPage";

// ============================================================================
// MOCKS: "Falsificando" as dependências externas para isolar o componente
// ============================================================================

// 1. Mock do Auth Controller: Finge que temos um usuário logado com cargo de tesouraria
vi.mock("../src/controllers/useAuthController", () => ({
  useAuthController: vi.fn(),
}));
import { useAuthController } from "../src/controllers/useAuthController";

// 2. Mock do Rifas Controller: Finge a comunicação com o banco de dados
vi.mock("../src/controllers/useRifasController", () => ({
  useRifasController: vi.fn(),
}));
import { useRifasController } from "../src/controllers/useRifasController";

// 3. Mock do Firebase Auth global: Evita que a biblioteca tente conectar com a internet real
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    // PREPARAÇÃO: Injeta os dados falsos antes de cada teste rodar
    vi.mocked(useAuthController).mockReturnValue({
      usuarioAtual: {
        uid: "123",
        email: "teste@unifei.br",
        cargo: "tesouraria",
        displayName: "Tester",
      } as any,
      loading: false,
      error: null,
      handleLogin: vi.fn(),
      handleRegister: vi.fn(),
      handleLogout: vi.fn(),
    });

    vi.mocked(useRifasController).mockReturnValue({
      buscarMinhasRifas: vi
        .fn()
        .mockResolvedValue([{ numero: "001", status: "disponivel" }]),
      buscarPendentes: vi.fn().mockResolvedValue([]),
      avaliarComprovante: vi.fn(),
      finalizarVenda: vi.fn(),
      loading: false,
    });

    vi.clearAllMocks();
  });

  // TESTE 1: Garante que a tela principal carrega com o cargo correto
  it("deve renderizar o cabeçalho do painel do aderido e buscar as rifas", async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    // waitFor é usado porque o nome pode demorar uns milissegundos para ser injetado
    await waitFor(() => {
      expect(screen.getByText(/Olá, Tester!/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Cargo:/i)).toBeInTheDocument();

    // Usamos getAllByText porque a palavra 'TESOURARIA' aparece tanto no perfil quanto no nome da aba
    const elementosTesouraria = screen.getAllByText(/TESOURARIA/i);
    expect(elementosTesouraria.length).toBeGreaterThan(0);
  });

  // TESTE 2: Simula a navegação do usuário clicando em outra aba
  it("deve trocar para a aba de prêmios ao clicar", async () => {
    const user = userEvent.setup(); // Prepara o simulador de mouse/teclado
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    // Busca a aba pelo "role" (papel de acessibilidade) e clica nela
    const abaPremios = screen.getByRole("tab", { name: /Prêmios/i });
    await user.click(abaPremios);

    // Garante que o conteúdo da aba Prêmios substituiu o conteúdo das rifas
    expect(
      await screen.findByText(/Os prêmios serão listados em breve/i),
    ).toBeInTheDocument();
  });
});
