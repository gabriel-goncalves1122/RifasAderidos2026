import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardSidebar } from "../src/views/components/DashboardSidebar"; // <-- Caminho correto

describe("Componente <DashboardSidebar />", () => {
  const mockOnClose = vi.fn();
  const mockOnMudarContexto = vi.fn();
  const mockOnLogout = vi.fn();

  it("Deve mostrar APENAS o acesso de Aderido se isAdmin for false", () => {
    render(
      <DashboardSidebar
        open={true}
        isAdmin={false}
        contextoAtual="aderido"
        onClose={mockOnClose}
        onMudarContexto={mockOnMudarContexto}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.getByText("Área do Aderido")).toBeInTheDocument();
    // A Tesouraria NÃO pode estar na tela
    expect(screen.queryByText("Painel da Tesouraria")).not.toBeInTheDocument();
  });

  it("Deve mostrar as opções de Tesouraria se isAdmin for true", () => {
    render(
      <DashboardSidebar
        open={true}
        isAdmin={true} // ADMIN LOGADO!
        contextoAtual="tesouraria"
        onClose={mockOnClose}
        onMudarContexto={mockOnMudarContexto}
        onLogout={mockOnLogout}
      />,
    );

    expect(screen.getByText("Acesso Administrativo")).toBeInTheDocument();
    expect(screen.getByText("Área do Aderido")).toBeInTheDocument();
    expect(screen.getByText("Painel da Tesouraria")).toBeInTheDocument();
  });

  it("Deve disparar a função de Logout ao clicar", () => {
    render(
      <DashboardSidebar
        open={true}
        isAdmin={false}
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
