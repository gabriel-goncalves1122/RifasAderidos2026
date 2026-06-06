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
  ticketMedio: 25,
};

describe("Componente: PixTransacoesResumoCards", () => {
  it("Deve renderizar os cards financeiros do fluxo Pix Pix", () => {
    render(<PixTransacoesResumoCards resumo={resumoMock} />);

    expect(screen.getByText("Recebido via Pix")).toBeInTheDocument();
    expect(screen.getByText("Aguardando Pix")).toBeInTheDocument();
    expect(screen.getByText("Não identificadas")).toBeInTheDocument();
    expect(screen.getByText("Ticket médio")).toBeInTheDocument();

    expect(screen.getByText("R$ 50,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 10,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 25,00")).toBeInTheDocument();
  });

  it("Deve mostrar as quantidades relevantes para tesouraria", () => {
    render(<PixTransacoesResumoCards resumo={resumoMock} />);

    expect(screen.getByText("2 pagamentos confirmados")).toBeInTheDocument();
    expect(screen.getByText("1 pagamentos pendentes")).toBeInTheDocument();
    expect(screen.getByText("Média dos Pix pagos")).toBeInTheDocument();
  });
});
