import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModalRelatorioIA } from "../src/views/components/ModalRelatorioIA";
import { TransacaoAgrupada } from "../src/views/components/AuditoriaTable"; // Import correto do tipo

describe("Componente <ModalRelatorioIA />", () => {
  const mockOnClose = vi.fn();
  const mockOnAprovarLote = vi.fn();
  const mockOnRejeitar = vi.fn();

  const transacaoAprovada: TransacaoAgrupada = {
    comprovante_url: "http://pix.com/1",
    vendedor_cpf: "111",
    vendedor_nome: "Maria",
    comprador_nome: "João",
    data_reserva: null,
    log_automacao: "✅ Pré-aprovado pela IA: Tudo certo",
    bilhetes: ["001"],
  };

  const transacaoDivergente: TransacaoAgrupada = {
    comprovante_url: "http://pix.com/2",
    vendedor_cpf: "222",
    vendedor_nome: "Pedro",
    comprador_nome: "Carlos",
    data_reserva: null,
    log_automacao: "⚠️ Divergência: Banco [Caixa] - Titular: Desconhecido",
    bilhetes: ["002"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve separar as transações em categorias e contar corretamente", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={[transacaoAprovada, transacaoDivergente]}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // Deve exibir 1 Aprovado e 1 Divergência
    expect(screen.getByText("Pré-Aprovados (1)")).toBeInTheDocument();
    expect(screen.getByText("Divergências (1)")).toBeInTheDocument();
  });

  it("Deve permitir a aprovação em lote das validadas pela IA", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={[transacaoAprovada]}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // O botão de aprovação em lote deve aparecer
    const btnAprovarLote = screen.getByRole("button", {
      name: /Aprovar os 1 comprovantes validados/i,
    });
    fireEvent.click(btnAprovarLote);

    expect(mockOnAprovarLote).toHaveBeenCalledWith([transacaoAprovada]);
  });

  it("Deve permitir a rejeição manual com motivo para casos divergentes", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={[transacaoDivergente]}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // Escreve um motivo na caixa de texto do card divergente
    const inputMotivo = screen.getByPlaceholderText(
      "Explique o motivo da recusa...",
    );
    fireEvent.change(inputMotivo, { target: { value: "Fraude detectada." } });

    // Clica no botão de recusar
    const btnRecusar = screen.getByRole("button", {
      name: /Recusar Comprovante/i,
    });
    fireEvent.click(btnRecusar);

    expect(mockOnRejeitar).toHaveBeenCalledWith(
      "http://pix.com/2",
      ["002"],
      "Fraude detectada.",
    );
  });

  it("Deve extrair os dados do log da IA e exibi-los", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={[transacaoDivergente]}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // O texto deve ter sido "limpo" do emoji e prefixo "Divergência: " e o Banco [Caixa] extraído
    expect(
      screen.getByText("⚠️ Banco [Caixa] - Titular: Desconhecido"),
    ).toBeInTheDocument();
    expect(screen.getByText("Caixa")).toBeInTheDocument(); // O Banco extraído para a caixinha
  });
});
