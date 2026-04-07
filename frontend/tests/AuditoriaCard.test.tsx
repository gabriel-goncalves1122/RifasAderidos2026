// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/AuditoriaCard.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditoriaCard } from "../src/views/components/AuditoriaCard"; // <-- Caminho correto

describe("Componente <AuditoriaCard />", () => {
  const mockOnAprovar = vi.fn();
  const mockOnRejeitar = vi.fn();
  const mockOnVerPix = vi.fn();

  // Objeto de transação falso ("mock") para usar nos testes
  const transacaoPadrao = {
    comprovante_url: "http://pix.com/imagem",
    vendedor_cpf: "111.111.111-11",
    vendedor_nome: "Gabriel Sampaio",
    comprador_nome: "Engenheiro Rico",
    data_reserva: "2026-10-15T12:00:00Z",
    log_automacao: undefined,
    bilhetes: ["010", "011", "012"], // 3 rifas devem custar R$ 30,00
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // TESTE 1: Renderização de Valores e Matemática
  // ========================================================================
  it("Deve calcular o valor total corretamente (Qtd de Rifas x R$10,00)", () => {
    render(
      <AuditoriaCard
        transacao={transacaoPadrao}
        isProcessando={false}
        onVerPix={mockOnVerPix}
        onAprovar={mockOnAprovar}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // Como são 3 bilhetes, o valor deve aparecer como 30,00
    expect(screen.getByText(/30,00/i)).toBeInTheDocument();

    // Verifica se os nomes do Vendedor e Comprador estão na tela
    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();

    // Verifica se as 'Chips' (tags coloridas) das rifas apareceram
    expect(screen.getByText("010")).toBeInTheDocument();
    expect(screen.getByText("012")).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 2: Feedback da Inteligência Artificial (OCR)
  // ========================================================================
  it("Deve exibir o log da automação se houver um parecer da IA", () => {
    render(
      <AuditoriaCard
        transacao={{
          ...transacaoPadrao,
          log_automacao: "✅ Pré-aprovado pela IA: Valor exato identificado.",
        }}
        isProcessando={false}
        onVerPix={mockOnVerPix}
        onAprovar={mockOnAprovar}
        onRejeitar={mockOnRejeitar}
      />,
    );

    expect(screen.getByText(/Pré-aprovado pela IA/i)).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 3: Caminho Feliz (Aprovação Direta)
  // ========================================================================
  it("Deve disparar a função onAprovar ao clicar no botão Aprovar", () => {
    render(
      <AuditoriaCard
        transacao={transacaoPadrao}
        isProcessando={false}
        onVerPix={mockOnVerPix}
        onAprovar={mockOnAprovar}
        onRejeitar={mockOnRejeitar}
      />,
    );

    const btnAprovar = screen.getByRole("button", { name: /aprovar/i });
    fireEvent.click(btnAprovar);

    // Deve enviar a URL do Pix e a lista das Rifas vendidas para o componente pai
    expect(mockOnAprovar).toHaveBeenCalledWith("http://pix.com/imagem", [
      "010",
      "011",
      "012",
    ]);
  });

  // ========================================================================
  // TESTE 4: Fluxo de Recusa em Duas Etapas (Segurança da Tesouraria)
  // ========================================================================
  it("Deve abrir a caixa de texto ao clicar em Rejeitar e só enviar após confirmação", () => {
    render(
      <AuditoriaCard
        transacao={transacaoPadrao}
        isProcessando={false}
        onVerPix={mockOnVerPix}
        onAprovar={mockOnAprovar}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // PASSO 1: O botão Aprovar deve estar visível e a caixa de texto escondida
    expect(
      screen.getByRole("button", { name: /aprovar/i }),
    ).toBeInTheDocument();
    const btnRejeitarInicial = screen.getByRole("button", {
      name: /rejeitar/i,
    });

    // PASSO 2: Clicamos em Rejeitar
    fireEvent.click(btnRejeitarInicial);

    // O botão Aprovar deve desaparecer, e o botão "Rejeitar" vira "Confirmar Recusa"
    expect(
      screen.queryByRole("button", { name: /aprovar/i }),
    ).not.toBeInTheDocument();
    const btnConfirmar = screen.getByRole("button", {
      name: /confirmar recusa/i,
    });

    // PASSO 3: Escrevemos o motivo da recusa no campo de texto
    const inputMotivo = screen.getByRole("textbox");
    fireEvent.change(inputMotivo, {
      target: { value: "Pix feito fora da data." },
    });

    // PASSO 4: Clicamos para confirmar e disparar a rejeição pro backend
    fireEvent.click(btnConfirmar);

    // VERIFICAÇÃO FINAL: A função do pai deve ser chamada com o motivo escrito
    expect(mockOnRejeitar).toHaveBeenCalledTimes(1);
    expect(mockOnRejeitar).toHaveBeenCalledWith(
      "http://pix.com/imagem",
      ["010", "011", "012"],
      "Pix feito fora da data.",
    );
  });
});
