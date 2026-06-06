import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PixAderidosTab } from "@/features/tesouraria/components/pix/tabs/PixAderidosTab";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";

describe("Aba: PixAderidosTab", () => {
  it("Deve mostrar nome, CPF, arrecadação e rifas restantes por aderido", () => {
    render(<PixAderidosTab transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText("000.000.000-00")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*30,00/)).toBeInTheDocument();
    expect(screen.getByText("117 rifas")).toBeInTheDocument();
  });

  it("Deve mostrar grupo sem aderido vinculado quando houver Pix não identificado", () => {
    render(<PixAderidosTab transacoes={pixTransacoesMock} />);

    expect(screen.getByText("Sem aderido vinculado")).toBeInTheDocument();
    expect(screen.getAllByText("CPF não informado").length).toBeGreaterThan(0);
    expect(screen.getByText(/R\$\s*20,00/)).toBeInTheDocument();
  });

  it("Deve abrir bottom sheet com detalhes de arrecadação ao tocar no card", () => {
    render(<PixAderidosTab transacoes={pixTransacoesMock} />);

    fireEvent.click(screen.getByRole("button", { name: /Gabriel Sampaio/i }));

    expect(screen.getByText("Transações relacionadas")).toBeInTheDocument();
    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*30,00/).length).toBeGreaterThan(1);
  });
});
