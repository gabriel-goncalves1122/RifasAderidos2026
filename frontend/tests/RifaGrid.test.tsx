// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/RifaGrid.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RifaGrid } from "../src/views/components/RifaGrid"; // <-- Caminho correto
import { Bilhete } from "../src/types/models";

describe("Componente <RifaGrid />", () => {
  const mockOnToggleRifa = vi.fn();

  // Uma lista de bilhetes com todos os cenários possíveis de status
  const bilhetesMisturados: Bilhete[] = [
    {
      numero: "001",
      status: "disponivel",
      vendedor_cpf: "111",
      comprador_id: null,
      data_reserva: null,
      data_pagamento: null,
      comprovante_url: null,
    },
    {
      numero: "002",
      status: "pendente",
      vendedor_cpf: "111",
      comprador_id: "comprador1",
      data_reserva: "2026",
      data_pagamento: null,
      comprovante_url: "url",
    },
    {
      numero: "003",
      status: "pago",
      vendedor_cpf: "111",
      comprador_id: "comprador2",
      data_reserva: "2026",
      data_pagamento: "2026",
      comprovante_url: "url",
    },
    {
      numero: "004",
      status: "reservado",
      vendedor_cpf: "111",
      comprador_id: "comprador3",
      data_reserva: "2026",
      data_pagamento: null,
      comprovante_url: null,
    },
  ];

  // ========================================================================
  // TESTE 1: Estados de Carregamento e Vazio
  // ========================================================================
  it("Deve exibir o loading quando a prop 'carregando' for true", () => {
    render(
      <RifaGrid
        bilhetes={[]}
        carregando={true}
        selecionadas={[]}
        onToggleRifa={mockOnToggleRifa}
      />,
    );
    expect(screen.getByText("Buscando bilhetes...")).toBeInTheDocument();
  });

  it("Deve exibir mensagem de vazio quando a lista de bilhetes for vazia", () => {
    render(
      <RifaGrid
        bilhetes={[]}
        carregando={false}
        selecionadas={[]}
        onToggleRifa={mockOnToggleRifa}
      />,
    );
    expect(
      screen.getByText("Nenhuma rifa encontrada nesta categoria."),
    ).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 2: Renderização Correta dos Números
  // ========================================================================
  it("Deve renderizar todos os números de bilhetes passados na lista", () => {
    render(
      <RifaGrid
        bilhetes={bilhetesMisturados}
        carregando={false}
        selecionadas={[]}
        onToggleRifa={mockOnToggleRifa}
      />,
    );

    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("002")).toBeInTheDocument();
    expect(screen.getByText("003")).toBeInTheDocument();
    expect(screen.getByText("004")).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 3: Regras de Interação (Clicar na Rifa)
  // ========================================================================
  it("Deve chamar a função onToggleRifa apenas se o bilhete estiver 'disponivel'", () => {
    render(
      <RifaGrid
        bilhetes={bilhetesMisturados}
        carregando={false}
        selecionadas={[]}
        onToggleRifa={mockOnToggleRifa}
      />,
    );

    // Clicar numa rifa disponivel
    const rifaDisponivel = screen.getByText("001");
    fireEvent.click(rifaDisponivel);
    expect(mockOnToggleRifa).toHaveBeenCalledTimes(1);
    expect(mockOnToggleRifa).toHaveBeenCalledWith("001");

    // Tentar clicar numa rifa que já está paga, pendente ou reservada
    fireEvent.click(screen.getByText("002")); // Pendente
    fireEvent.click(screen.getByText("003")); // Pago
    fireEvent.click(screen.getByText("004")); // Reservado

    // O contador de chamadas da função não deve aumentar (continua em 1)
    expect(mockOnToggleRifa).toHaveBeenCalledTimes(1);
  });
});
