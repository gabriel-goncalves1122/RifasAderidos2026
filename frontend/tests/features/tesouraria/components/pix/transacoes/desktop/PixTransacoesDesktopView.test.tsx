import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PixTransacoesDesktopView } from "@/features/tesouraria/components/pix/transacoes/desktop/PixTransacoesDesktopView";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";
import { calcularResumoPixTransacoes } from "@/features/tesouraria/utils/pixTransacoesUtils";

describe("Componente: PixTransacoesDesktopView", () => {
  it("Deve renderizar a visão desktop com filtros, legenda e tabela", () => {
    render(
      <PixTransacoesDesktopView
        resumo={calcularResumoPixTransacoes(pixTransacoesMock)}
        filtros={{ status: "todas", busca: "" }}
        transacoes={pixTransacoesMock}
        onChangeFiltros={vi.fn()}
        onAceitarTransacao={vi.fn()}
        onNegarTransacao={vi.fn()}
      />,
    );

    expect(screen.getByText(/Aguardando validação:/i)).toBeInTheDocument();
    expect(screen.queryByText("Validadas")).not.toBeInTheDocument();
    expect(screen.getByText("Legenda de status")).toBeInTheDocument();
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
        onAceitarTransacao={vi.fn()}
        onNegarTransacao={vi.fn()}
      />,
    );

    expect(screen.getByText("Nenhuma transação encontrada")).toBeInTheDocument();
  });
});
