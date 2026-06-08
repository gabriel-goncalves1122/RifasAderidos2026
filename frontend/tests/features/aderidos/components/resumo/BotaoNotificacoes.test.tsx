// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/BotaoNotificacoes.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BotaoNotificacoes } from "@/features/aderidos/components/resumo/BotaoNotificacoes";

describe("Componente: BotaoNotificacoes", () => {
  it("Deve renderizar o botão de notificações", () => {
    render(
      <BotaoNotificacoes
        notificacoesNaoLidas={0}
        onAbrirNotificacoes={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /abrir notificações/i,
      }),
    ).toBeInTheDocument();
  });

  it("Deve chamar onAbrirNotificacoes ao clicar no botão", async () => {
    const user = userEvent.setup();
    const onAbrirNotificacoes = vi.fn();

    render(
      <BotaoNotificacoes
        notificacoesNaoLidas={0}
        onAbrirNotificacoes={onAbrirNotificacoes}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /abrir notificações/i,
      }),
    );

    expect(onAbrirNotificacoes).toHaveBeenCalledTimes(1);
  });

  it("Deve exibir a quantidade de notificações não lidas", () => {
    render(
      <BotaoNotificacoes
        notificacoesNaoLidas={3}
        onAbrirNotificacoes={vi.fn()}
      />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("Não deve exibir badge numérico quando não houver notificações", () => {
    render(
      <BotaoNotificacoes
        notificacoesNaoLidas={0}
        onAbrirNotificacoes={vi.fn()}
      />,
    );

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
