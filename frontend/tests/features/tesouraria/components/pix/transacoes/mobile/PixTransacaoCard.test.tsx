import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PixTransacaoCard } from "@/features/tesouraria/components/pix/transacoes/mobile/PixTransacaoCard";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";

describe("Componente: PixTransacaoCard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve renderizar os dados principais da transação Pix no mobile", () => {
    render(<PixTransacaoCard transacao={pixTransacoesMock[0]} />);

    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();

    expect(screen.getByText("Rifa 010")).toBeInTheDocument();
    expect(screen.getByText("Rifa 011")).toBeInTheDocument();
    expect(screen.getByText("Rifa 012")).toBeInTheDocument();

    expect(screen.getByText("Pago")).toBeInTheDocument();
    expect(screen.getByText("Conciliada")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*30,00/)).toBeInTheDocument();
  });

  it("Deve mostrar fallback quando não houver aderido ou rifas", () => {
    render(<PixTransacaoCard transacao={pixTransacoesMock[2]} />);

    expect(screen.getByText("Pagador Não Identificado")).toBeInTheDocument();
    expect(screen.getByText("Sem aderido vinculado")).toBeInTheDocument();
    expect(screen.getByText("Sem rifas vinculadas")).toBeInTheDocument();
    expect(screen.getByText("Não identificada")).toBeInTheDocument();
  });

  it("Deve permitir clicar para copiar o reference ID sem quebrar a tela", () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText,
      },
    });

    render(<PixTransacaoCard transacao={pixTransacoesMock[0]} />);

    fireEvent.click(screen.getByLabelText("Copiar reference ID"));

    expect(writeText).toHaveBeenCalledWith(pixTransacoesMock[0].referenceId);
  });
});
