import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PixAderidoDetalhesDrawer } from "@/features/tesouraria/components/pix/tabs/aderidos/PixAderidoDetalhesDrawer";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";
import { agruparPixAderidos } from "@/features/tesouraria/utils/pixAderidosUtils";

describe("Componente: PixAderidoDetalhesDrawer", () => {
  it("Deve renderizar métricas e transações pagas do aderido selecionado", () => {
    const [aderido] = agruparPixAderidos(pixTransacoesMock);

    render(<PixAderidoDetalhesDrawer aderido={aderido} onClose={() => undefined} />);

    expect(screen.getByText("Transações relacionadas")).toBeInTheDocument();
    expect(screen.getByText("Rifas restantes")).toBeInTheDocument();
    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*30,00/).length).toBeGreaterThan(0);
  });

  it("Deve renderizar estado sem Pix pago vinculado", () => {
    const [aderido] = agruparPixAderidos(pixTransacoesMock);

    render(
      <PixAderidoDetalhesDrawer
        aderido={{
          ...aderido,
          transacoes: aderido.transacoes.filter(
            (transacao) => transacao.statusPagamento !== "PAID",
          ),
        }}
        onClose={() => undefined}
      />,
    );

    expect(screen.getByText("Nenhum Pix pago vinculado.")).toBeInTheDocument();
  });
});
