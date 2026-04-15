// ============================================================================
// ARQUIVO: frontend/tests/auditoria/ModalInspecaoIA.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ModalInspecaoIA } from "../../src/views/components/tesouraria/ModalInspecaoIA";
import { TransacaoAgrupada } from "../../src/views/components/tesouraria/AuditoriaTable";

describe("Componente <ModalInspecaoIA />", () => {
  const transacaoMock: TransacaoAgrupada = {
    comprovante_url: "http://pix.com/1",
    vendedor_cpf: "111.111.111-11",
    vendedor_nome: "Vendedor A",
    comprador_nome: "Comprador A",
    data_reserva: "2026-05-10T10:00:00Z",
    bilhetes: ["001"],
    valor_total: 10,
  };

  const dadosOcrMock = {
    banco: "NUBANK",
    idTransacao: "E1234567890",
    titularLido: "Comprador A",
  };

  it("Não deve renderizar nada se a transação for nula", () => {
    const { container } = render(
      <ModalInspecaoIA transacao={null} dadosOcr={null} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("Deve exibir os dados de acareação corretamente", () => {
    render(
      <ModalInspecaoIA
        transacao={transacaoMock}
        dadosOcr={dadosOcrMock}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText(/Inspetor de Comprovativo/i)).toBeInTheDocument();
    expect(screen.getByText("E1234567890")).toBeInTheDocument();
    expect(screen.getByText("NUBANK")).toBeInTheDocument();
    expect(screen.getAllByText("Comprador A").length).toBeGreaterThan(0); // Titular Lido e Expectativa
  });
});
