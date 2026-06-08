import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NotificacoesSidebar } from "@/shared/components/NotificacoesSidebar";

describe("Componente <NotificacoesSidebar />", () => {
  const mockOnClose = vi.fn();

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

  it("Deve tratar notificações legadas como correção de dados", () => {
    render(
      <NotificacoesSidebar
        open={true}
        onClose={mockOnClose}
        notificacoes={[
          {
            id: "notif_1",
            titulo: "Comprovante Recusado",
            mensagem: "Dados do comprador incompletos.",
            rifas: ["045", "046"],
            data_criacao: "2026-10-15T12:00:00Z",
          },
        ]}
      />,
    );

    expect(screen.getByText("Corrigir dados")).toBeInTheDocument();
    expect(
      screen.getByText("Dados do comprador incompletos."),
    ).toBeInTheDocument();
    expect(screen.getByText("Rifas para corrigir")).toBeInTheDocument();
    expect(screen.getByText("045")).toBeInTheDocument();
    expect(screen.getByText("046")).toBeInTheDocument();
    expect(screen.queryByText("Comprovante Recusado")).not.toBeInTheDocument();
  });

  it("Deve renderizar notificação de rifa liberada", () => {
    render(
      <NotificacoesSidebar
        open={true}
        onClose={mockOnClose}
        notificacoes={[
          {
            id: "notif_2",
            tipo: "rifa_liberada",
            mensagem: "Pagamento não confirmado pelo banco.",
            rifas: ["010"],
            data_criacao: "2026-10-15T12:00:00Z",
          },
        ]}
      />,
    );

    expect(screen.getByText("Rifa disponível")).toBeInTheDocument();
    expect(
      screen.getByText("Pagamento não confirmado pelo banco."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Rifas disponíveis novamente"),
    ).toBeInTheDocument();
    expect(screen.getByText("010")).toBeInTheDocument();
  });

  it("Deve renderizar notificação informativa com título recebido", () => {
    render(
      <NotificacoesSidebar
        open={true}
        onClose={mockOnClose}
        notificacoes={[
          {
            id: "notif_3",
            tipo: "informativo",
            titulo: "Atualização",
            mensagem: "Nova mensagem do sistema.",
            rifas: [],
          },
        ]}
      />,
    );

    expect(screen.getByText("Atualização")).toBeInTheDocument();
    expect(screen.getByText("Nova mensagem do sistema.")).toBeInTheDocument();
    expect(screen.queryByText("Rifas relacionadas")).not.toBeInTheDocument();
  });
});
