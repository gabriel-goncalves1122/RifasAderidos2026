import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PixHeader } from "@/features/tesouraria/components/pix/layout/PixHeader";

describe("Componente: PixHeader", () => {
  it("Deve renderizar o contexto da tela de tesouraria Pix", () => {
    render(
      <PixHeader sincronizando={false} onSincronizar={vi.fn()} />,
    );

    expect(screen.getByText("Tesouraria")).toBeInTheDocument();
    expect(screen.getByText("Recebimentos Pix")).toBeInTheDocument();
    expect(
      screen.getByText(/Acompanhe recebimentos, conciliação e aderidos/i),
    ).toBeInTheDocument();
  });

  it("Deve chamar sincronização ao clicar no botão", () => {
    const onSincronizar = vi.fn();

    render(
      <PixHeader
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
      <PixHeader sincronizando onSincronizar={vi.fn()} />,
    );

    expect(screen.queryByText("Sincronizando...")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /atualizar informações pix/i }),
    ).toBeDisabled();
  });
});
