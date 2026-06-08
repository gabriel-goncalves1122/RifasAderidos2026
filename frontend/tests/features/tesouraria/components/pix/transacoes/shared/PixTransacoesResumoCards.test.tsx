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

    expect(screen.getByText("Aguardando validação")).toBeInTheDocument();
    expect(screen.getByText("Validadas")).toBeInTheDocument();
    expect(screen.getByText("Pendências de vínculo")).toBeInTheDocument();
    expect(screen.getByText("Canceladas/Erros")).toBeInTheDocument();

    expect(screen.getByText("R$ 10,00")).toBeInTheDocument();
  });

  it("Deve mostrar as quantidades relevantes para tesouraria", () => {
    render(<PixTransacoesResumoCards resumo={resumoMock} />);

    expect(
      screen.getByText("Transações pendentes de análise"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Confirmadas e vinculadas a aderido/rifa"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Recebidas mas não associadas a aderido"),
    ).toBeInTheDocument();
  });
});
