import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NotificacoesSidebar } from "../../src/views/components/comuns/NotificacoesSidebar"; // <-- Caminho correto

describe("Componente <NotificacoesSidebar />", () => {
  const mockOnClose = vi.fn();

  const mockNotificacao = [
    {
      id: "notif_1",
      titulo: "Comprovante Recusado ⚠️",
      mensagem: "Imagem ilegível.",
      rifas: ["045", "046"],
      data_criacao: "2026-10-15T12:00:00Z",
    },
  ];

  it("Deve exibir a mensagem amigável quando não houver notificações", () => {
    render(
      <NotificacoesSidebar
        open={true}
        onClose={mockOnClose}
        notificacoes={[]}
      />,
    );

    expect(
      screen.getByText("Você não tem novas mensagens."),
    ).toBeInTheDocument();
  });

  it("Deve renderizar os dados da notificação e as tags das rifas devolvidas", () => {
    render(
      <NotificacoesSidebar
        open={true}
        onClose={mockOnClose}
        notificacoes={mockNotificacao}
      />,
    );

    // Verifica Título e Motivo
    expect(screen.getByText("Comprovante Recusado ⚠️")).toBeInTheDocument();
    expect(screen.getByText("Motivo: Imagem ilegível.")).toBeInTheDocument();

    // Verifica se as rifas devolvidas apareceram como tags (chips)
    expect(screen.getByText("045")).toBeInTheDocument();
    expect(screen.getByText("046")).toBeInTheDocument();
  });
});
