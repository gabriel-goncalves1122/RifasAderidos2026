import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PixTransacoesFiltros } from "@/features/tesouraria/components/pix/transacoes/shared/PixTransacoesFiltros";
import { PixTransacoesFiltros as PixTransacoesFiltrosState } from "@/features/tesouraria/types/pixTransacoes";

const filtrosBase: PixTransacoesFiltrosState = {
  status: "novas",
  busca: "",
};

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

describe("Componente: PixTransacoesFiltros", () => {
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: matchMediaOriginal,
    });

    vi.restoreAllMocks();
  });

  it("Deve renderizar os filtros essenciais para auditoria Pix", () => {
    render(<PixTransacoesFiltros filtros={filtrosBase} onChangeFiltros={vi.fn()} />);

    expect(screen.getByPlaceholderText("Buscar Pix")).toBeInTheDocument();

    expect(screen.getByText("Novas")).toBeInTheDocument();
    expect(screen.getByText("Recusadas")).toBeInTheDocument();
    expect(screen.getByText("Aguardando Pagamento")).toBeInTheDocument();

    expect(screen.queryByText("Para validar")).not.toBeInTheDocument();
    expect(screen.queryByText("Aceitas")).not.toBeInTheDocument();
    expect(screen.queryByText("Negadas")).not.toBeInTheDocument();
    expect(screen.queryByText("Sem confirmação bancária")).not.toBeInTheDocument();
  });

  it("Deve atualizar busca ao digitar no campo", () => {
    const onChangeFiltros = vi.fn();

    render(
      <PixTransacoesFiltros filtros={filtrosBase} onChangeFiltros={onChangeFiltros} />,
    );

    fireEvent.change(screen.getByPlaceholderText("Buscar Pix"), {
      target: { value: "Gabriel" },
    });

    expect(onChangeFiltros).toHaveBeenCalledWith({
      ...filtrosBase,
      busca: "Gabriel",
    });
  });

  it("Deve alterar filtro rápido para Recusadas", () => {
    const onChangeFiltros = vi.fn();

    render(
      <PixTransacoesFiltros filtros={filtrosBase} onChangeFiltros={onChangeFiltros} />,
    );

    fireEvent.click(screen.getByText("Recusadas"));

    expect(onChangeFiltros).toHaveBeenCalledWith({
      ...filtrosBase,
      status: "recusadas",
    });
  });

  it("Deve manter a busca visível no mobile e mostrar contador de filtros", () => {
    const onChangeFiltros = vi.fn();
    simularMobile();

    render(
      <PixTransacoesFiltros filtros={filtrosBase} onChangeFiltros={onChangeFiltros} />,
    );

    expect(screen.getByText("Sem filtros ativos")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Buscar Pix"), {
      target: { value: "Ana" },
    });

    expect(onChangeFiltros).toHaveBeenCalledWith({
      ...filtrosBase,
      busca: "Ana",
    });
  });

  it("Deve limpar busca e filtro rápido ativos no mobile", () => {
    const onChangeFiltros = vi.fn();
    simularMobile();

    render(
      <PixTransacoesFiltros
        filtros={{ status: "recusadas", busca: "Gabriel" }}
        onChangeFiltros={onChangeFiltros}
      />,
    );

    expect(screen.getByText("2 filtros ativos")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /limpar filtros pix/i }));

    expect(onChangeFiltros).toHaveBeenCalledWith({
      status: "novas",
      busca: "",
    });
  });
});
