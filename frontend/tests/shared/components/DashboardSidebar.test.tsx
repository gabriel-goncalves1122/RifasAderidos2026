// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/DashboardSidebar.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardSidebar } from "@/shared/components/DashboardSidebar";
import { dashboardSidebarStyles } from "@/shared/styles/dashboardSidebarStyles";

describe("Componente <DashboardSidebar />", () => {
  const mockOnClose = vi.fn();
  const mockOnMudarContexto = vi.fn();
  const mockOnLogout = vi.fn();

  it("Deve mostrar APENAS o acesso de Aderido para um usuário comum", () => {
    render(
      <DashboardSidebar
        open={true}
        isSuperAdmin={false}
        hasTesourariaAccess={false}
        hasSecretariaAccess={false}
        contextoAtual="aderido"
        onClose={mockOnClose}
        onMudarContexto={mockOnMudarContexto}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.getByText("Área do Aderido")).toBeInTheDocument();
    expect(screen.queryByText("Painel da Tesouraria")).not.toBeInTheDocument();
    expect(screen.queryByText("Painel da Secretaria")).not.toBeInTheDocument();
  });

  it("Deve mostrar a Tesouraria se hasTesourariaAccess for true", () => {
    render(
      <DashboardSidebar
        open={true}
        isSuperAdmin={false}
        hasTesourariaAccess={true}
        hasSecretariaAccess={false}
        contextoAtual="tesouraria"
        onClose={mockOnClose}
        onMudarContexto={mockOnMudarContexto}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.getByText("Tesouraria")).toBeInTheDocument(); // Rótulo do perfil
    expect(screen.getByText("Área do Aderido")).toBeInTheDocument();
    expect(screen.getByText("Painel da Tesouraria")).toBeInTheDocument();
    expect(screen.queryByText("Painel da Secretaria")).not.toBeInTheDocument();
  });

  it("Deve mostrar TODAS as abas para a Presidência (Super Admin)", () => {
    render(
      <DashboardSidebar
        open={true}
        isSuperAdmin={true}
        hasTesourariaAccess={true}
        hasSecretariaAccess={true}
        contextoAtual="secretaria"
        onClose={mockOnClose}
        onMudarContexto={mockOnMudarContexto}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.getByText("Administração Geral")).toBeInTheDocument(); // Rótulo do perfil
    expect(screen.getByText("Área do Aderido")).toBeInTheDocument();
    expect(screen.getByText("Painel da Tesouraria")).toBeInTheDocument();
    expect(screen.getByText("Painel da Secretaria")).toBeInTheDocument();
  });

  it("Deve disparar a função de Logout ao clicar", () => {
    render(
      <DashboardSidebar
        open={true}
        isSuperAdmin={false}
        hasTesourariaAccess={false}
        hasSecretariaAccess={false}
        contextoAtual="aderido"
        onClose={mockOnClose}
        onMudarContexto={mockOnMudarContexto}
        onLogout={mockOnLogout}
      />,
    );

    const btnLogout = screen.getByText("Sair da Conta");
    fireEvent.click(btnLogout);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it("Deve usar o topo verde do dashboard sem a borda dourada antiga", () => {
    expect(dashboardSidebarStyles.drawerPaper).toMatchObject({
      bgcolor: "#F6F8F7",
      backgroundImage: "linear-gradient(#063D31, #063D31)",
      backgroundSize: "100% env(safe-area-inset-top, 0px)",
    });

    expect(dashboardSidebarStyles.header).toMatchObject({
      bgcolor: "#063D31",
      borderBottom: "1px solid rgba(255, 255, 255, 0.14)",
    });
    expect(dashboardSidebarStyles.header).not.toHaveProperty(
      "borderBottom",
      "4px solid var(--cor-dourado-brilho)",
    );

    expect(dashboardSidebarStyles.itemButton(true)).toMatchObject({
      bgcolor: "#EAF3EF",
      color: "#063D31",
    });
  });

  it("Deve chamar onMudarContexto e onClose ao clicar nos itens do menu", () => {
    render(
      <DashboardSidebar
        open={true}
        isSuperAdmin={true}
        hasTesourariaAccess={true}
        hasSecretariaAccess={true}
        contextoAtual="aderido"
        onClose={mockOnClose}
        onMudarContexto={mockOnMudarContexto}
        onLogout={mockOnLogout}
      />
    );

    const aderidoMenu = screen.getByText("Área do Aderido");
    fireEvent.click(aderidoMenu);
    expect(mockOnMudarContexto).toHaveBeenCalledWith("aderido");
    expect(mockOnClose).toHaveBeenCalled();

    const secretariaMenu = screen.getByText("Painel da Secretaria");
    fireEvent.click(secretariaMenu);
    expect(mockOnMudarContexto).toHaveBeenCalledWith("secretaria");
    expect(mockOnClose).toHaveBeenCalledTimes(2);

    const tesourariaMenu = screen.getByText("Painel da Tesouraria");
    fireEvent.click(tesourariaMenu);
    expect(mockOnMudarContexto).toHaveBeenCalledWith("tesouraria");
    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });
});
