// ============================================================================
// ARQUIVO: frontend/tests/HistoricoDetalhadoTab.spec.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HistoricoDetalhadoTab } from "../src/views/components/HistoricoDetalhadoTab";
import { useRifasController } from "../src/controllers/useRifasController";

// Mock do Controller
vi.mock("../src/controllers/useRifasController", () => ({
  useRifasController: vi.fn(),
}));

describe("Componente: HistoricoDetalhadoTab", () => {
  const mockBuscarHistoricoDetalhado = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRifasController as any).mockReturnValue({
      buscarHistoricoDetalhado: mockBuscarHistoricoDetalhado,
    });
  });

  it("deve agrupar rifas compradas juntas na mesma linha da tabela", async () => {
    // Simulando 2 rifas (001 e 002) compradas no mesmo milissegundo pela mesma pessoa
    const transacoesFalsas = [
      {
        data_reserva: "2026-10-15T10:00:00Z",
        data_pagamento: "2026-10-16T10:00:00Z",
        vendedor_nome: "Aderido Silva",
        vendedor_cpf: "111.111.111-11",
        comprador_nome: "Dona Maria",
        comprador_email: "maria@gmail.com",
        status: "pago",
        numero_rifa: "001",
        valor: 10,
      },
      {
        data_reserva: "2026-10-15T10:00:00Z", // MESMA DATA/HORA DA COMPRA
        data_pagamento: "2026-10-16T10:00:00Z",
        vendedor_nome: "Aderido Silva",
        vendedor_cpf: "111.111.111-11",
        comprador_nome: "Dona Maria", // MESMO COMPRADOR
        comprador_email: "maria@gmail.com",
        status: "pago",
        numero_rifa: "002",
        valor: 10,
      },
    ];

    mockBuscarHistoricoDetalhado.mockResolvedValueOnce(transacoesFalsas);

    render(<HistoricoDetalhadoTab />);

    // Espera a tabela carregar e exibir o nome do comprador
    expect(await screen.findByText("Dona Maria")).toBeInTheDocument();

    // VALIDAÇÃO CRÍTICA DO AGRUPAMENTO:
    // Como foram duas rifas de R$ 10 juntas, a tabela deve mostrar "R$ 20,00"
    expect(screen.getByText("R$ 20,00")).toBeInTheDocument();

    // Deve mostrar os dois bilhetes juntos na mesma célula (001, 002)
    expect(screen.getByText("001, 002")).toBeInTheDocument();
  });

  it("deve exibir estado vazio se não houver histórico", async () => {
    mockBuscarHistoricoDetalhado.mockResolvedValueOnce([]);

    render(<HistoricoDetalhadoTab />);

    expect(
      await screen.findByText(/Nenhuma venda registrada até o momento/i),
    ).toBeInTheDocument();
  });
});
