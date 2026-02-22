import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HistoricoDetalhadoTab } from "../src/views/components/HistoricoDetalhadoTab";
import * as RifasController from "../src/controllers/useRifasController";

// Mock do hook controlador
vi.mock("../src/controllers/useRifasController");

describe("Componente: HistoricoDetalhadoTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir estado vazio se não houver histórico", async () => {
    vi.mocked(RifasController.useRifasController).mockReturnValue({
      buscarHistoricoDetalhado: vi.fn().mockResolvedValue([]),
    } as any);

    render(<HistoricoDetalhadoTab />);

    expect(
      await screen.findByText(/Nenhum resultado encontrado/i),
    ).toBeInTheDocument();
  });

  it("deve agrupar rifas compradas juntas na mesma linha da tabela", async () => {
    const mockTransacoes = [
      {
        id: "1",
        data_reserva: "2026-05-10T10:00:00Z",
        comprador_nome: "Dona Maria",
        vendedor_nome: "João Aderido",
        numero_rifa: "001",
        status: "pago",
        valor: 10,
      },
      {
        id: "2",
        data_reserva: "2026-05-10T10:00:00Z", // Mesma data e hora exata!
        comprador_nome: "Dona Maria", // Mesmo comprador!
        vendedor_nome: "João Aderido",
        numero_rifa: "002",
        status: "pago",
        valor: 10,
      },
    ];

    vi.mocked(RifasController.useRifasController).mockReturnValue({
      buscarHistoricoDetalhado: vi.fn().mockResolvedValue(mockTransacoes),
    } as any);

    render(<HistoricoDetalhadoTab />);

    // Espera a tabela carregar. Como temos Tabela (Desktop) e Cards (Mobile),
    // usamos getAllByText para pegar todas as ocorrências e checamos se a primeira existe.
    await waitFor(() => {
      const elementos = screen.getAllByText("Dona Maria");
      expect(elementos.length).toBeGreaterThan(0);
    });

    // VALIDAÇÃO CRÍTICA DO AGRUPAMENTO:
    // Os dois números "001" e "002" devem aparecer agrupados num único texto: "001, 002"
    const rifasAgrupadas = screen.getAllByText("001, 002");
    expect(rifasAgrupadas.length).toBeGreaterThan(0);

    // O valor deve ter somado para R$ 20,00
    const valorSomado = screen.getAllByText(/R\$ 20,00/i);
    expect(valorSomado.length).toBeGreaterThan(0);
  });
});
