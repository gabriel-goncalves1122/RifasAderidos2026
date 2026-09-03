import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PixHeader } from "@/features/tesouraria/components/pix/layout/PixHeader";

describe("Componente: PixHeader", () => {
  it("Deve renderizar o contexto da tela de tesouraria Pix", () => {
    render(
      <PixHeader
        abaAtual="transacoes"
        sincronizando={false}
        onSincronizar={vi.fn()}
      />,
    );

    expect(screen.getByText("Tesouraria")).toBeInTheDocument();
    expect(screen.getByText("Recebimentos Pix")).toBeInTheDocument();
    expect(
      screen.getByText(/Revise Pix confirmados pelo banco/i),
    ).toBeInTheDocument();
  });

  it("Deve trocar subtítulo conforme a aba Pix", () => {
    render(
      <PixHeader
        abaAtual="conciliacao"
        sincronizando={false}
        onSincronizar={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/Vincule pagamentos recebidos/i),
    ).toBeInTheDocument();
  });

  it("Deve chamar sincronização ao clicar no botão", () => {
    const onSincronizar = vi.fn();

    render(
      <PixHeader
        abaAtual="visao-geral"
        sincronizando={false}
        onSincronizar={onSincronizar}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /atualizar informações pix/i }),
    );

    expect(onSincronizar).toHaveBeenCalledTimes(1);
  });

  it("Deve mostrar estado de sincronização", () => {
    render(
      <PixHeader
        abaAtual="aderidos"
        sincronizando
        onSincronizar={vi.fn()}
      />,
    );

    expect(screen.queryByText("Sincronizando...")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /atualizar informações pix/i }),
    ).toBeDisabled();
  });
});
