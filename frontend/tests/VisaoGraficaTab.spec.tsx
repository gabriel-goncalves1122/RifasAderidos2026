// ============================================================================
// ARQUIVO: frontend/tests/VisaoGraficaTab.spec.tsx
// ============================================================================
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VisaoGraficaTab } from "../src/views/components/VisaoGraficaTab";
import { useRifasController } from "../src/controllers/useRifasController";

// 1. Mock do Controller
vi.mock("../src/controllers/useRifasController", () => ({
  useRifasController: vi.fn(),
}));

// 2. Mock do Recharts (Essencial para não dar erro de "tamanho negativo" no teste)
vi.mock("recharts", async () => {
  const OriginalRecharts = await vi.importActual<any>("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 300 }}>{children}</div>
    ),
  };
});

describe("Componente: VisaoGraficaTab", () => {
  const mockBuscarRelatorio = vi.fn();
  const mockBuscarHistoricoDetalhado = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRifasController as any).mockReturnValue({
      buscarRelatorio: mockBuscarRelatorio,
      buscarHistoricoDetalhado: mockBuscarHistoricoDetalhado,
    });
  });

  it("deve renderizar os cards de resumo com os dados corretos", async () => {
    // Preparando os dados falsos do Backend
    mockBuscarRelatorio.mockResolvedValueOnce({
      resumoGeral: { totalArrecadado: 500, rifasPagas: 50, aderidosAtivos: 10 },
      aderidos: [],
    });
    mockBuscarHistoricoDetalhado.mockResolvedValueOnce([]);

    render(<VisaoGraficaTab />);

    // Espera os dados carregarem e verifica se o valor de R$ 500 apareceu no card
    expect(await screen.findByText(/500/i)).toBeInTheDocument();
    expect(screen.getByText(/Caixa Validado/i)).toBeInTheDocument();
    expect(screen.getByText(/50 bilhetes/i)).toBeInTheDocument();
    expect(screen.getByText(/10 alunos/i)).toBeInTheDocument();
  });

  it("deve renderizar os títulos dos gráficos na tela", async () => {
    mockBuscarRelatorio.mockResolvedValueOnce({
      resumoGeral: { totalArrecadado: 0, rifasPagas: 0, aderidosAtivos: 0 },
      aderidos: [],
    });
    mockBuscarHistoricoDetalhado.mockResolvedValueOnce([]);

    render(<VisaoGraficaTab />);

    expect(
      await screen.findByText(/Evolução do Faturamento/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Status de Pagamento/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Engajamento: Metas da Turma/i),
    ).toBeInTheDocument();
  });
});
