import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PixConciliacaoTab } from "@/features/tesouraria/components/pix/tabs/PixConciliacaoTab";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";

describe("Aba: PixConciliacaoTab", () => {
  it("Deve renderizar contexto de pendências de conciliação", () => {
    render(<PixConciliacaoTab transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Pendências de conciliação")).toBeInTheDocument();
    expect(
      screen.getByText(/Transações Pix que precisam de vínculo com venda/i),
    ).toBeInTheDocument();
  });

  it("Deve mostrar transações não identificadas", () => {
    render(<PixConciliacaoTab transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Pagador Não Identificado")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /abrir detalhes da transação pix pagador não identificado/i,
      }),
    );

    expect(screen.getByText("Sem rifas")).toBeInTheDocument();
  });
});
