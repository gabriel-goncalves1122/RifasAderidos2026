// ============================================================================
// ARQUIVO: frontend/tests/DashBoardPage.spec.tsx
// ============================================================================
import { render, screen, waitFor } from "@testing-library/react";
// (se tiver userEvent, deixe também, só tire o fireEvent)
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { DashboardPage } from "../src/views/pages/DashboardPage";

// MOCKS DAS DEPENDÊNCIAS
vi.mock("../src/controllers/useAuthController", () => ({
  useAuthController: vi.fn(),
}));
import { useAuthController } from "../src/controllers/useAuthController";

vi.mock("../src/controllers/useRifasController", () => ({
  useRifasController: vi.fn(),
}));
import { useRifasController } from "../src/controllers/useRifasController";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe("DashboardPage (Novo Layout Híbrido)", () => {
  beforeEach(() => {
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
      buscarRelatorio: vi.fn(),
      error: null,
      buscarHistoricoDetalhado: vi.fn(),
      buscarPremios: vi
        .fn()
        .mockResolvedValue({ infoSorteio: {}, premios: [] }),
      salvarInfoSorteio: vi.fn(),
      salvarPremio: vi.fn(),
      excluirPremio: vi.fn(),
      uploadImagemPremio: vi.fn(),
    });

    vi.clearAllMocks();
  });

  it("deve renderizar o painel do aderido e abrir o menu da tesouraria", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    // 1. Verifica se a tela inicial (Aderido) carregou
    await waitFor(() => {
      expect(screen.getAllByText(/Olá, Tester!/i).length).toBeGreaterThan(0);
    });
    expect(await screen.findByText(/Bloco de Vendas/i)).toBeInTheDocument();

    // 2. Simula o clique no botão de Menu (Hambúrguer)
    const btnMenu = screen.getByRole("button", { name: /menu/i });
    await user.click(btnMenu);

    // 3. Verifica se o Drawer abriu e mostrou as opções de Admin
    // 3. Verifica se o Drawer abriu e mostrou as opções de Admin
    expect(await screen.findByText(/Portal da Comissão/i)).toBeInTheDocument(); // <-- Título atualizado
    expect(screen.getByText(/Painel da Tesouraria/i)).toBeInTheDocument();
  });

  it("deve alterar a aba selecionada no cabeçalho", async () => {
    const user = userEvent.setup(); // Usando a simulação real
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    const abaMinhasRifas = screen.getByRole("tab", { name: /Minhas Rifas/i });
    expect(abaMinhasRifas).toHaveAttribute("aria-selected", "true");

    const abaPremios = screen.getByRole("tab", { name: /Prêmios/i });
    expect(abaPremios).toHaveAttribute("aria-selected", "false");

    // Clica na aba usando o userEvent e espera a ação terminar
    await user.click(abaPremios);

    // Valida o resultado final
    await waitFor(() => {
      expect(abaPremios).toHaveAttribute("aria-selected", "true");
    });
  });
});
