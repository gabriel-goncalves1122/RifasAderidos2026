import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PixTabs } from "@/features/tesouraria/components/pix/layout/PixTabs";

const matchMediaOriginal = window.matchMedia;

function simularMobile() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Componente: PixTabs", () => {
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: matchMediaOriginal,
    });

    vi.restoreAllMocks();
  });

  it("Deve renderizar as abas principais da tesouraria", () => {
    render(
      <PixTabs abaAtual="visao-geral" onChangeAba={vi.fn()} />,
    );

    expect(
      screen.getByRole("tablist", {
        name: /navegação da tesouraria/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("tab", { name: /visão geral/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /validar transações/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /vincular pagamentos/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /aderidos/i })).toBeInTheDocument();
  });

  it("Não deve renderizar conciliação na navegação mobile", () => {
    simularMobile();

    render(
      <PixTabs abaAtual="visao-geral" onChangeAba={vi.fn()} />,
    );

    expect(screen.getByRole("tab", { name: /visão geral/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /validar transações/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /vincular pagamentos/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /aderidos/i })).toBeInTheDocument();
  });

  it("Deve trocar para aba de auditoria Pix", () => {
    const onChangeAba = vi.fn();

    render(
      <PixTabs
        abaAtual="visao-geral"
        onChangeAba={onChangeAba}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: /validar transações/i }));

    expect(onChangeAba).toHaveBeenCalledWith("transacoes");
  });
});
