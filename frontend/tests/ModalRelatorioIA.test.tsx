// ============================================================================
// ARQUIVO: frontend/tests/ModalRelatorioIA.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModalRelatorioIA } from "../src/views/components/ModalRelatorioIA";

describe("Componente <ModalRelatorioIA />", () => {
  const mockOnClose = vi.fn();
  const mockOnAprovarLote = vi.fn();
  const mockOnRejeitar = vi.fn();

  // Dados falsos (mocks) para simular o que a IA devolve
  const transacoesMock = [
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
        "✅ Pré-aprovado pela IA: Banco [NUBANK] - ID E12345 | Titular: Comprador A",
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
        "⚠️ Divergência: Banco [ITAU] - ID E99999 | Titular: Desconhecido",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // TESTE 1: Contagem das Filas e Acordeões
  // ========================================================================
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

    // Verifica se os títulos dos acordeões mostram (1) aprovada e (1) divergente
    expect(
      screen.getByText(/Pré-Aprovados com Sucesso \(1\)/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Requerem Auditoria Manual \(1\)/i),
    ).toBeInTheDocument();

    // Verifica se os bancos extraídos estão a ser renderizados nos cartões
    expect(screen.getByText("NUBANK")).toBeInTheDocument();
    expect(screen.getByText("ITAU")).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 2: Aprovação em Lote ("Carimbar")
  // ========================================================================
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
      name: /Carimbar e Aprovar todos os 1 comprovantes/i,
    });
    fireEvent.click(btnAprovarLote);

    // Deve chamar a função passando apenas a "Transação 1" (Aprovada)
    expect(mockOnAprovarLote).toHaveBeenCalledTimes(1);
    expect(mockOnAprovarLote).toHaveBeenCalledWith([transacoesMock[0]]);
  });

  // ========================================================================
  // TESTE 3: Recusa de Divergência com Motivo
  // ========================================================================
  it("Deve permitir digitar um motivo e recusar um comprovativo divergente", () => {
    render(
      <ModalRelatorioIA
        open={true}
        onClose={mockOnClose}
        transacoes={transacoesMock}
        onAprovarLote={mockOnAprovarLote}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // Procura a caixa de texto específica da aba de divergências
    const inputMotivo = screen.getByPlaceholderText(
      /Ex: Não encontrei o ID no sistema/i,
    );
    fireEvent.change(inputMotivo, {
      target: { value: "Fraude detetada no ID." },
    });

    // Clica no botão de recusar
    const btnRecusar = screen.getByRole("button", { name: /Recusar/i });
    fireEvent.click(btnRecusar);

    // Verifica se a função pai recebeu a URL correta, as rifas e o motivo
    expect(mockOnRejeitar).toHaveBeenCalledTimes(1);
    expect(mockOnRejeitar).toHaveBeenCalledWith(
      "http://pix.com/2",
      ["002", "003"],
      "Fraude detetada no ID.",
    );
  });

  // ========================================================================
  // TESTE 4: Abertura do Sub-Modal (Acareação)
  // ========================================================================
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

    // Clica no primeiro botão de inspecionar que encontrar
    const btnInspecionar = screen.getAllByRole("button", {
      name: /Inspecionar Imagem/i,
    })[0];
    fireEvent.click(btnInspecionar);

    // Verifica se o título do Sub-Modal negro da Acareação apareceu
    expect(screen.getByText(/Inspetor de Comprovativo/i)).toBeInTheDocument();

    // Verifica se a extração do ID da transação 1 aparece gigante na tela de acareação
    expect(screen.getAllByText(/E12345/i).length).toBeGreaterThan(0);
  });
});
