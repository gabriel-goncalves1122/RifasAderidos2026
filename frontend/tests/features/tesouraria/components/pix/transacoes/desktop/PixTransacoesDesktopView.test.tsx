import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PixTransacoesDesktopView } from "@/features/tesouraria/components/pix/transacoes/desktop/PixTransacoesDesktopView";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";
import { calcularResumoPixTransacoes } from "@/features/tesouraria/utils/pixTransacoesUtils";

describe("Componente: PixTransacoesDesktopView", () => {
  it("Deve renderizar a visão desktop com filtros e tabela", () => {
    render(
      <PixTransacoesDesktopView
        resumo={calcularResumoPixTransacoes(pixTransacoesMock)}
        filtros={{ status: "todas", busca: "" }}
        transacoes={pixTransacoesMock}
        onChangeFiltros={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText("Buscar Pix")).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: "Pagador" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
  });

  it("Deve renderizar empty state quando não houver transações", () => {
    render(
      <PixTransacoesDesktopView
        resumo={calcularResumoPixTransacoes([])}
        filtros={{ status: "todas", busca: "" }}
        transacoes={[]}
        onChangeFiltros={vi.fn()}
      />,
    );

    expect(screen.getByText("Nenhuma transação encontrada")).toBeInTheDocument();
  });
});
