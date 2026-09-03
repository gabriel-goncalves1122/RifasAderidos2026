// ============================================================================
// ARQUIVO: frontend/tests/features/aderidos/components/resumo/HeaderAderido.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HeaderAderido } from "@/features/aderidos/components/resumo/HeaderAderido";

describe("Componente: HeaderAderido", () => {
  it("Deve renderizar saudação sem texto explicativo", () => {
    render(
      <HeaderAderido
        primeiroNome="Gabriel"
        notificacoesNaoLidas={0}
        onAbrirNotificacoes={vi.fn()}
      />,
    );

    expect(screen.getByText("Meu Painel")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Olá, Gabriel/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/fluxo alinhado com a tesouraria/i),
    ).not.toBeInTheDocument();
  });

  it("Deve usar saudação neutra quando não houver nome", () => {
    render(
      <HeaderAderido
        primeiroNome="Aderido"
        notificacoesNaoLidas={0}
        onAbrirNotificacoes={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Olá" })).toBeInTheDocument();
    expect(screen.queryByText(/Olá, Aderido/i)).not.toBeInTheDocument();
  });

  it("Deve permitir abrir notificações", async () => {
    const user = userEvent.setup();
    const onAbrirNotificacoes = vi.fn();

    render(
      <HeaderAderido
        primeiroNome="Gabriel"
        notificacoesNaoLidas={2}
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
});
