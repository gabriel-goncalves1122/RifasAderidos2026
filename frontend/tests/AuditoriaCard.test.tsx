// ============================================================================
// ARQUIVO: frontend/tests/AuditoriaCard.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditoriaCard } from "../src/views/components/tesouraria/AuditoriaCard";

describe("Componente <AuditoriaCard />", () => {
  const mockOnAprovar = vi.fn();
  const mockOnRejeitar = vi.fn();
  const mockOnVerPix = vi.fn();

  const transacaoPadrao = {
    comprovante_url: "http://pix.com/imagem",
    vendedor_cpf: "111.111.111-11",
    vendedor_nome: "Gabriel Sampaio",
    comprador_nome: "Engenheiro Rico",
    data_reserva: "2026-10-15T12:00:00Z",
    ia_mensagem: undefined,
    bilhetes: ["010", "011", "012"],
    valor_total: 30, // <-- Adicionado para bater com a nova interface
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve calcular o valor total corretamente", () => {
    render(
      <AuditoriaCard
        transacao={transacaoPadrao}
        isProcessando={false}
        onVerPix={mockOnVerPix}
        onAprovar={mockOnAprovar}
        onRejeitar={mockOnRejeitar}
      />,
    );
    expect(screen.getByText(/30,00/i)).toBeInTheDocument();
    expect(screen.getByText("Gabriel Sampaio")).toBeInTheDocument();
    expect(screen.getByText("Engenheiro Rico")).toBeInTheDocument();
    expect(screen.getByText("010")).toBeInTheDocument();
  });

  it("Deve exibir o log da automação se houver um parecer da IA", () => {
    render(
      <AuditoriaCard
        transacao={{
          ...transacaoPadrao,
          ia_mensagem: "✅ Pré-aprovado pela IA: Valor exato.",
        }}
        isProcessando={false}
        onVerPix={mockOnVerPix}
        onAprovar={mockOnAprovar}
        onRejeitar={mockOnRejeitar}
      />,
    );
    expect(screen.getAllByText(/Pré-aprovado pela IA/i).length).toBeGreaterThan(
      0,
    );
  });

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
    expect(mockOnAprovar).toHaveBeenCalledWith("http://pix.com/imagem", [
      "010",
      "011",
      "012",
    ]);
  });

  it("Deve abrir a caixa de texto ao clicar em Reprovar e só enviar após confirmação", () => {
    render(
      <AuditoriaCard
        transacao={transacaoPadrao}
        isProcessando={false}
        onVerPix={mockOnVerPix}
        onAprovar={mockOnAprovar}
        onRejeitar={mockOnRejeitar}
      />,
    );

    // Agora o botão é "Reprovar" e não "Rejeitar"
    const btnReprovarInicial = screen.getByRole("button", {
      name: /reprovar/i,
    });
    fireEvent.click(btnReprovarInicial);

    expect(
      screen.queryByRole("button", { name: /aprovar/i }),
    ).not.toBeInTheDocument();
    const btnConfirmar = screen.getByRole("button", {
      name: /confirmar recusa/i,
    });

    const inputMotivo = screen.getByRole("textbox");
    fireEvent.change(inputMotivo, { target: { value: "Pix incorreto." } });
    fireEvent.click(btnConfirmar);

    expect(mockOnRejeitar).toHaveBeenCalledTimes(1);
    expect(mockOnRejeitar).toHaveBeenCalledWith(
      "http://pix.com/imagem",
      ["010", "011", "012"],
      "Pix incorreto.",
    );
  });
});
