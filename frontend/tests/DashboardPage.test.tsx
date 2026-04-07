import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardPage } from "../src/views/pages/DashboardPage";
import { useAuthController } from "../src/controllers/useAuthController";

// 1. Mock do Auth Controller
vi.mock("../src/controllers/useAuthController", () => ({
  useAuthController: vi.fn(),
}));

// 2. Mocks dos Componentes Filhos (Para não renderizar a tela inteira em cada teste)
vi.mock("../src/views/components/DashboardSidebar", () => ({
  DashboardSidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("../src/views/components/MinhasRifasTab", () => ({
  MinhasRifasTab: () => <div>Conteudo: Minhas Rifas</div>,
}));
vi.mock("../src/views/components/PremiosTab", () => ({
  PremiosTab: () => <div>Conteudo: Premios</div>,
}));
vi.mock("../src/views/components/AuditoriaTable", () => ({
  AuditoriaTable: () => <div>Conteudo: Auditoria</div>,
}));

describe("Página <DashboardPage />", () => {
  const mockHandleLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear(); // Limpa a memória do navegador falso antes de cada teste
  });

  it("Deve renderizar o Portal do Aderido para usuários normais", () => {
    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "membro" },
      handleLogout: mockHandleLogout,
    });

    render(<DashboardPage />);

    // Verifica o Título do Cabeçalho
    expect(screen.getByText("PORTAL DO ADERIDO")).toBeInTheDocument();

    // Verifica se as abas corretas apareceram
    expect(screen.getByText("Minhas Rifas")).toBeInTheDocument();
    expect(screen.getByText("Prêmios")).toBeInTheDocument();

    // A aba da tesouraria não deve existir
    expect(screen.queryByText("Aprovar Pix")).not.toBeInTheDocument();
  });

  it("Deve renderizar a Gestão Financeira para usuários Admin (Tesouraria)", () => {
    sessionStorage.setItem("dashboard_contexto", "tesouraria"); // Força o Admin a abrir a tela da tesouraria

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "tesouraria" },
      handleLogout: mockHandleLogout,
    });

    render(<DashboardPage />);

    expect(screen.getByText("GESTÃO FINANCEIRA")).toBeInTheDocument();
    expect(screen.getByText("Aprovar Pix")).toBeInTheDocument();
    expect(screen.getByText("Desempenho")).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
  });

  it("MECANISMO DE SEGURANÇA: Deve expulsar um Aderido que tente acessar a Tesouraria forçando a SessionStorage", async () => {
    // Simulando um ataque: O aderido mudou a variável no navegador para 'tesouraria'
    sessionStorage.setItem("dashboard_contexto", "tesouraria");

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "membro" }, // Mas o backend diz que ele é membro!
      handleLogout: mockHandleLogout,
    });

    render(<DashboardPage />);

    // O useEffect deve detetar a fraude e atirar o usuário de volta para o Portal do Aderido
    await waitFor(() => {
      expect(screen.getByText("PORTAL DO ADERIDO")).toBeInTheDocument();
      expect(screen.queryByText("GESTÃO FINANCEIRA")).not.toBeInTheDocument();
    });
  });
});
