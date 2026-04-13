// ============================================================================
// ARQUIVO: frontend/tests/DashboardPage.test.tsx
// ============================================================================
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardPage } from "../../src/views/pages/DashboardPage";
import { useAuthController } from "../../src/controllers/useAuthController";

vi.mock("../../src/controllers/useAuthController", () => ({
  useAuthController: vi.fn(),
}));

// 2. Mocks dos Componentes Filhos (Agora com as novas pastas!)
vi.mock("../../src/views/components/comuns/DashboardSidebar", () => ({
  DashboardSidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("../../src/views/components/aderidos/MinhasRifasTab", () => ({
  MinhasRifasTab: () => <div>Conteudo: Minhas Rifas</div>,
}));
vi.mock("../../src/views/components/premios/PremiosTab", () => ({
  PremiosTab: () => <div>Conteudo: Premios</div>,
}));
vi.mock("../../src/views/components/tesouraria/AuditoriaTable", () => ({
  AuditoriaTable: () => <div>Conteudo: Auditoria</div>,
}));
vi.mock("../../src/views/components/tesouraria/VisaoGraficaTab", () => ({
  VisaoGraficaTab: () => <div>Conteudo: VisaoGrafica</div>,
}));
vi.mock("../../src/views/components/tesouraria/HistoricoDetalhadoTab", () => ({
  HistoricoDetalhadoTab: () => <div>Conteudo: Historico</div>,
}));
vi.mock("../../src/views/pages/SecretariaPage", () => ({
  SecretariaView: () => <div>Conteudo: Secretaria</div>, // O Componente ainda chama-se SecretariaView
}));

describe("Página <DashboardPage />", () => {
  const mockHandleLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("Deve renderizar o Portal do Aderido para usuários normais", () => {
    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "aderido" },
      handleLogout: mockHandleLogout,
      loading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText("PORTAL DO ADERIDO")).toBeInTheDocument();
    expect(screen.getByText("Minhas Rifas")).toBeInTheDocument();
    expect(screen.getByText("Prêmios")).toBeInTheDocument();
    expect(screen.queryByText("Aprovar Pix")).not.toBeInTheDocument();
  });

  it("Deve renderizar a Gestão Financeira para a Tesouraria", () => {
    sessionStorage.setItem("dashboard_contexto", "tesouraria");

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "tesouraria" },
      handleLogout: mockHandleLogout,
      loading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText("GESTÃO FINANCEIRA")).toBeInTheDocument();
    expect(screen.getByText("Aprovar Pix")).toBeInTheDocument();
  });

  it("Deve renderizar a Secretaria para membros com esse cargo", () => {
    sessionStorage.setItem("dashboard_contexto", "secretaria");

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "secretaria" },
      handleLogout: mockHandleLogout,
      loading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText("SECRETARIA DA COMISSÃO")).toBeInTheDocument();
    expect(screen.getByText("Conteudo: Secretaria")).toBeInTheDocument();
  });

  it("MECANISMO DE SEGURANÇA: Deve expulsar um Aderido que tente acessar a Tesouraria", async () => {
    sessionStorage.setItem("dashboard_contexto", "tesouraria");

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "aderido" },
      handleLogout: mockHandleLogout,
      loading: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("PORTAL DO ADERIDO")).toBeInTheDocument();
      expect(screen.queryByText("GESTÃO FINANCEIRA")).not.toBeInTheDocument();
    });
  });

  it("MECANISMO DE SEGURANÇA: Deve expulsar um Tesoureiro que tente acessar a Secretaria", async () => {
    sessionStorage.setItem("dashboard_contexto", "secretaria");

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "tesouraria" },
      handleLogout: mockHandleLogout,
      loading: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("PORTAL DO ADERIDO")).toBeInTheDocument();
      expect(
        screen.queryByText("SECRETARIA DA COMISSÃO"),
      ).not.toBeInTheDocument();
    });
  });
});
