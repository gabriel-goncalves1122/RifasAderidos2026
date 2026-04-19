// ============================================================================
// ARQUIVO: frontend/tests/aderidos/EstatisticasAderido.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EstatisticasAderido } from "../../src/views/components/aderidos/EstatiticasAderidos";

describe("Componente: EstatisticasAderido", () => {
  it("Deve renderizar a saudação e o valor arrecadado corretamente", () => {
    render(
      <EstatisticasAderido
        primeiroNome="Gabriel"
        valorArrecadado={350}
        notificacoesNaoLidas={0}
        onAbrirNotificacoes={vi.fn()}
      />,
    );

    expect(screen.getByText("Olá, Gabriel!")).toBeInTheDocument();
    expect(screen.getByText("R$ 350,00")).toBeInTheDocument();
  });

  it("Deve exibir o número de notificações não lidas no badge", () => {
    render(
      <EstatisticasAderido
        primeiroNome="Gabriel"
        valorArrecadado={0}
        notificacoesNaoLidas={3}
        onAbrirNotificacoes={vi.fn()}
      />,
    );

    // O Badge renderiza o texto '3' dentro dele
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("Deve chamar a função onAbrirNotificacoes ao clicar no ícone do sino", () => {
    const mockOnAbrir = vi.fn();
    render(
      <EstatisticasAderido
        primeiroNome="Gabriel"
        valorArrecadado={0}
        notificacoesNaoLidas={1}
        onAbrirNotificacoes={mockOnAbrir}
      />,
    );

    // Encontra o botão pelo Tooltip ou pelo Role
    const botaoSino = screen.getByRole("button", {
      name: /Avisos da Tesouraria/i,
    });
    fireEvent.click(botaoSino);

    expect(mockOnAbrir).toHaveBeenCalledTimes(1);
  });
});
