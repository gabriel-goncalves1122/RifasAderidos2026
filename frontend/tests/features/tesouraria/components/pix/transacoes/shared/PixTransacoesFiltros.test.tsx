import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PixTransacoesFiltros } from "@/features/tesouraria/components/pix/transacoes/shared/PixTransacoesFiltros";
import { PixTransacoesFiltros as PixTransacoesFiltrosState } from "@/features/tesouraria/types/pixTransacoes";

const filtrosBase: PixTransacoesFiltrosState = {
  status: "todas",
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

  it("Deve renderizar somente os filtros essenciais para Pix síncrono", () => {
    render(<PixTransacoesFiltros filtros={filtrosBase} onChangeFiltros={vi.fn()} />);

    expect(screen.getByPlaceholderText("Buscar Pix")).toBeInTheDocument();

    expect(screen.getByText("Todas")).toBeInTheDocument();
    expect(screen.getByText("Pagas")).toBeInTheDocument();
    expect(screen.getByText("Não vinculadas")).toBeInTheDocument();
    expect(screen.getByText("Canceladas")).toBeInTheDocument();

    expect(screen.queryByText("Autorizados")).not.toBeInTheDocument();
    expect(screen.queryByText("Em análise")).not.toBeInTheDocument();
    expect(screen.queryByText("Aguardando")).not.toBeInTheDocument();
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

  it("Deve alterar filtro rápido para Pagas", () => {
    const onChangeFiltros = vi.fn();

    render(
      <PixTransacoesFiltros filtros={filtrosBase} onChangeFiltros={onChangeFiltros} />,
    );

    fireEvent.click(screen.getByText("Pagas"));

    expect(onChangeFiltros).toHaveBeenCalledWith({
      ...filtrosBase,
      status: "pagas",
    });
  });

  it("Deve abrir a busca recolhida no mobile antes de digitar", () => {
    const onChangeFiltros = vi.fn();
    simularMobile();

    render(
      <PixTransacoesFiltros filtros={filtrosBase} onChangeFiltros={onChangeFiltros} />,
    );

    expect(screen.queryByPlaceholderText("Buscar Pix")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /buscar pix/i }));

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
        filtros={{ status: "pagas", busca: "Gabriel" }}
        onChangeFiltros={onChangeFiltros}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /limpar filtros pix/i }));

    expect(onChangeFiltros).toHaveBeenCalledWith({
      status: "todas",
      busca: "",
    });
  });
});
