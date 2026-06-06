// ============================================================================
// ARQUIVO: frontend/tests/DashboardPage.test.tsx
// ============================================================================
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardPage } from "@/views/pages/DashboardPage";
import { useAuthController } from "@/features/auth/hooks/useAuthController";

vi.mock("@/features/auth/hooks/useAuthController", () => ({
  useAuthController: vi.fn(),
}));

vi.mock("@/shared/components/DashboardSidebar", () => ({
  DashboardSidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("@/features/aderidos/MinhasRifasTab", () => ({
  MinhasRifasTab: () => <div>Conteudo: Minhas Rifas</div>,
}));
vi.mock("@/features/premios/PremiosTab", () => ({
  PremiosTab: () => <div>Conteudo: Premios</div>,
}));
vi.mock("@/features/tesouraria/pages/TesourariaPixPage", () => ({
  TesourariaPixPage: () => <div>Conteudo: Pix</div>,
}));
vi.mock("@/features/tesouraria/pages/DesempenhoPage", () => ({
  DesempenhoPage: () => <div>Conteudo: Desempenho</div>,
}));
vi.mock("@/features/tesouraria/pages/AuditoriaComprasPage", () => ({
  AuditoriaComprasPage: () => <div>Conteudo: Auditoria de compras</div>,
}));
vi.mock("@/features/secretaria/pages/SecretariaPage", () => ({
  SecretariaView: () => <div>Conteudo: Secretaria</div>,
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

    expect(screen.getByText("Portal do aderido")).toBeInTheDocument();
    expect(screen.getByText("Minhas Rifas")).toBeInTheDocument();
    expect(screen.getByText("Prêmios")).toBeInTheDocument();
    expect(screen.getByText("Conteudo: Minhas Rifas")).toBeInTheDocument();
    expect(screen.queryByText("Pix")).not.toBeInTheDocument();
  });

  it("Deve renderizar a Gestão Financeira para a Tesouraria", () => {
    sessionStorage.setItem("dashboard_contexto", "tesouraria");

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "tesouraria" },
      handleLogout: mockHandleLogout,
      loading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText("Gestão financeira")).toBeInTheDocument();
    expect(screen.getByText("Gestão financeira da comissão")).toBeInTheDocument();
    expect(screen.getByText("Pix")).toBeInTheDocument();
    expect(screen.getByText("Desempenho")).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Conteudo: Pix")).toBeInTheDocument();
  });

  it("Deve renderizar a Secretaria para membros com esse cargo", () => {
    sessionStorage.setItem("dashboard_contexto", "secretaria");

    (useAuthController as any).mockReturnValue({
      usuarioAtual: { cargo: "secretaria" },
      handleLogout: mockHandleLogout,
      loading: false,
    });

    render(<DashboardPage />);

    expect(screen.getByText("Secretaria")).toBeInTheDocument();
    expect(screen.getByText("Gestão de aderidos")).toBeInTheDocument();
    expect(screen.getByText("Aderidos")).toBeInTheDocument();
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
      expect(screen.getByText("Portal do aderido")).toBeInTheDocument();
      expect(screen.queryByText("Gestão financeira")).not.toBeInTheDocument();
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
      expect(screen.getByText("Portal do aderido")).toBeInTheDocument();
      expect(screen.queryByText("Secretaria")).not.toBeInTheDocument();
    });
  });
});
