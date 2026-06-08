import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PixTransacoesResumoCards } from "@/features/tesouraria/components/pix/transacoes/shared/PixTransacoesResumoCards";
import { PixTransacoesResumo } from "../../../../../types/pixTransacoes";

const resumoMock: PixTransacoesResumo = {
  totalRecebido: 50,
  totalPendente: 10,
  totalCancelado: 10,
  totalDivergente: 20,
  quantidadePagas: 2,
  quantidadeAguardando: 1,
  quantidadeCanceladas: 1,
  quantidadeNaoIdentificadas: 1,
  quantidadeAguardandoValidacao: 2,
  quantidadeAceitas: 3,
  quantidadeNegadas: 1,
  quantidadeSemConfirmacaoBancaria: 1,
  quantidadeComRifas: 4,
  quantidadeSemVinculo: 2,
  ticketMedio: 25,
};

describe("Componente: PixTransacoesResumoCards", () => {
  it("Deve renderizar os cards da fila de auditoria Pix", () => {
    render(<PixTransacoesResumoCards resumo={resumoMock} />);

    expect(screen.getByText("Para validar")).toBeInTheDocument();
    expect(screen.getByText("Com rifas")).toBeInTheDocument();
    expect(screen.getByText("Sem vínculo")).toBeInTheDocument();
    expect(screen.getByText("Pendentes do banco")).toBeInTheDocument();

    expect(screen.getByText("R$ 10,00")).toBeInTheDocument();
  });

  it("Deve mostrar as quantidades relevantes para tesouraria", () => {
    render(<PixTransacoesResumoCards resumo={resumoMock} />);

    expect(screen.getByText("2 Pix pagos ou legados")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("1 não identificada(s)")).toBeInTheDocument();
  });
});
