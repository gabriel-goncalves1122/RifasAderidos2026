// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/DashboardSidebar.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardSidebar } from "../../src/views/components/comuns/DashboardSidebar";

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
});
