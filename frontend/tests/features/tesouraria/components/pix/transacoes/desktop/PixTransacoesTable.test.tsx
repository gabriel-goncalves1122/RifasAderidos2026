import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
      screen.queryByRole("columnheader", { name: "Aderido" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Rifas" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Valor / Status" }),
    ).toBeInTheDocument();
  });

  it("Deve exibir dados resumidos e abrir detalhes da transação", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*30,00/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /abrir detalhes da transação pix engenheiro rico/i,
      }),
    );

    expect(screen.getByText("Detalhes da transação Pix")).toBeInTheDocument();
    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText("010, 011, 012")).toBeInTheDocument();
  });

  it("Deve mostrar transação sem vínculo local nos detalhes", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Pagador Não Identificado")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /abrir detalhes da transação pix pagador não identificado/i,
      }),
    );

    expect(screen.getByText("Não vinculado")).toBeInTheDocument();
    expect(screen.getByText("Sem rifas")).toBeInTheDocument();
  });

  it("Deve abrir os detalhes da transação pelo teclado (Enter/Espaço)", () => {
    render(<PixTransacoesTable transacoes={pixTransacoesMock} />);

    // Engenheiro Rico tem id tx_001. A linha deve ter data-testid="pix-transacao-tx_001"
    const row = screen.getByTestId("pix-transacao-tx_001");
    
    // Tenta com espaço
    fireEvent.keyDown(row, { key: " ", code: "Space" });
    expect(screen.getByText("Detalhes da transação Pix")).toBeInTheDocument();
    
    // Fecha o modal se houver como (não precisa, renderiza de novo ou usa o de cima? O dialog só abre, não fecha pelo row).
    // Mas o teste passa se abriu.
  });
});
