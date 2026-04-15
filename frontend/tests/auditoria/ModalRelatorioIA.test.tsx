// ============================================================================
// ARQUIVO: frontend/tests/auditoria/ModalRelatorioIA.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModalRelatorioIA } from "../../src/views/components/tesouraria/ModalRelatorioIA";
import { TransacaoAgrupada } from "../../src/views/components/tesouraria/AuditoriaTable";

describe("Componente <ModalRelatorioIA />", () => {
  const mockOnClose = vi.fn();
  const mockOnAprovarLote = vi.fn();
  const mockOnRejeitar = vi.fn();

  const transacoesMock: TransacaoAgrupada[] = [
    {
      comprovante_url: "http://pix.com/1",
      vendedor_cpf: "111.111.111-11",
      vendedor_nome: "Vendedor A",
      comprador_nome: "Comprador A",
      data_reserva: "2026-05-10T10:00:00Z",
      bilhetes: ["001"],
      valor_total: 10,
      ia_resultado: "APROVADO",
      ia_mensagem:
        "✅ Pré-aprovado pela IA: Banco [NUBANK] - ID E12345 | lido Titular: Comprador A - Validado por ID.",
    },
    {
      comprovante_url: "http://pix.com/2",
      vendedor_cpf: "222.222.222-22",
      vendedor_nome: "Vendedor B",
      comprador_nome: "Comprador B",
      data_reserva: "2026-05-10T11:00:00Z",
      bilhetes: ["002", "003"],
      valor_total: 20,
      ia_resultado: "DIVERGENTE",
      ia_mensagem:
        "⚠️ Divergência: Banco [ITAU] - ID ILEGÍVEL | lido Titular: DESCONHECIDO - ID ausente.",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve renderizar os acordeões com a contagem correta de aprovadas e divergentes", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={transacoesMock}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    expect(
      screen.getByText(/Pré-Aprovados com Sucesso \(1\)/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Requerem Auditoria Manual \(1\)/i),
    ).toBeInTheDocument();
  });

  it("Deve disparar a função de aprovação em lote apenas com as transações aprovadas", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={transacoesMock}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    const btnAprovarLote = screen.getByRole("button", {
      name: /Aprovar todos os 1/i,
    });
    fireEvent.click(btnAprovarLote);

    expect(mockOnAprovarLote).toHaveBeenCalledTimes(1);
    expect(mockOnAprovarLote).toHaveBeenCalledWith([transacoesMock[0]]);
  });

  it("Deve abrir o inspetor de comprovativo ao clicar em Inspecionar Imagem", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={transacoesMock}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    const btnInspecionar = screen.getAllByRole("button", {
      name: /Inspecionar Imagem/i,
    })[0];
    fireEvent.click(btnInspecionar);

    expect(screen.getByText(/Inspetor de Comprovativo/i)).toBeInTheDocument();
  });
});
