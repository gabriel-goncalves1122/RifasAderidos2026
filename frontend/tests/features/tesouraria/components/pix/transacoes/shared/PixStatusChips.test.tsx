import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  StatusConciliacaoChip,
  StatusPagamentoChip,
} from "@/features/tesouraria/components/pix/transacoes/shared/PixStatusChips";

describe("Componente: TransacaoStatusChip", () => {
  it("Deve traduzir status de pagamento do Pix", () => {
    render(<StatusPagamentoChip status="PAID" />);

    expect(screen.getByText("Pago")).toBeInTheDocument();
  });

  it("Deve traduzir status de pagamento cancelado", () => {
    render(<StatusPagamentoChip status="CANCELED" />);

    expect(screen.getByText("Cancelado")).toBeInTheDocument();
  });

  it("Deve traduzir status de conciliação interna", () => {
    render(<StatusConciliacaoChip status="nao_identificada" />);

    expect(screen.getByText("Não identificada")).toBeInTheDocument();
  });
});
