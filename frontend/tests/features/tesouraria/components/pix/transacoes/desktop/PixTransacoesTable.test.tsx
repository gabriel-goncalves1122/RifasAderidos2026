import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PixTransacoesTable } from "@/features/tesouraria/components/pix/transacoes/desktop/PixTransacoesTable";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";

describe("Componente: PixTransacoesTable", () => {
  it("Deve renderizar colunas principais da análise Pix", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByRole("columnheader", { name: "Data" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Pagador" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Aderido" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Rifas" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Situação" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Valor" })).toBeInTheDocument();
  });

  it("Deve exibir dados relevantes das últimas transações", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();

    expect(screen.getByText("010, 011, 012")).toBeInTheDocument();

    expect(screen.getAllByText("Aguardando validação").length).toBeGreaterThan(0);
    expect(screen.getByText(/R\$\s*30,00/)).toBeInTheDocument();
  });

  it("Deve mostrar transação sem vínculo local", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Pagador Não Identificado")).toBeInTheDocument();
    expect(screen.getByText("Sem aderido")).toBeInTheDocument();
    expect(screen.getByText("Sem rifas")).toBeInTheDocument();
  });

  it("Deve habilitar ações de auditoria para Pix confirmado pelo banco", () => {
    const onAceitarTransacao = vi.fn();
    const onNegarTransacao = vi.fn();

    render(
      <PixTransacoesTable
        transacoes={pixTransacoesMock}
        onAceitarTransacao={onAceitarTransacao}
        onNegarTransacao={onNegarTransacao}
      />,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /aceitar/i })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: /negar/i })[0]);

    expect(onAceitarTransacao).toHaveBeenCalledWith("tx_001");
    expect(onNegarTransacao).toHaveBeenCalledWith("tx_001");
    expect(screen.queryByText("Aguardando banco")).not.toBeInTheDocument();
  });
});
