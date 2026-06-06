import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PixTransacoesTable } from "@/features/tesouraria/components/pix/transacoes/desktop/PixTransacoesTable";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";

describe("Componente: PixTransacoesTable", () => {
  it("Deve renderizar colunas principais da análise Pix", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByRole("columnheader", { name: "Data" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Pagador / Reference ID" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Aderido" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Rifas" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Status Pix" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Conciliação" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Valor" })).toBeInTheDocument();
  });

  it("Deve exibir dados relevantes das últimas transações", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText("venda-rifas-010-011-012")).toBeInTheDocument();

    expect(screen.getByText("010")).toBeInTheDocument();
    expect(screen.getByText("011")).toBeInTheDocument();
    expect(screen.getByText("012")).toBeInTheDocument();

    expect(screen.getAllByText("Pago").length).toBeGreaterThan(0);
    expect(screen.getByText("Conciliada")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*30,00/)).toBeInTheDocument();
  });

  it("Deve mostrar transação sem vínculo local", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Pagador Não Identificado")).toBeInTheDocument();
    expect(screen.getByText("pix-sem-venda-local")).toBeInTheDocument();
    expect(screen.getByText("Sem aderido")).toBeInTheDocument();
    expect(screen.getByText("Não identificada")).toBeInTheDocument();
  });
});
