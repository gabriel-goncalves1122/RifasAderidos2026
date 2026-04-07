import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VisaoGraficaTab } from "../src/views/components/VisaoGraficaTab";
import { useTesouraria } from "../src/controllers/useTesouraria";

// 1. Mock do Controller da Tesouraria
vi.mock("../src/controllers/useTesouraria", () => ({
  useTesouraria: vi.fn(),
}));

// 2. Mock do Recharts (MÁGICA: O Recharts falha em testes se não tiver um tamanho fixo)
vi.mock("recharts", async () => {
  const OriginalRecharts = await vi.importActual<any>("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 300 }}>{children}</div>
    ),
  };
});

describe("Componente <VisaoGraficaTab />", () => {
  const mockBuscarRelatorio = vi.fn();
  const mockBuscarHistoricoDetalhado = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // CORREÇÃO: Fica só (useTesouraria as any) sem o vi.mocked!
    (useTesouraria as any).mockReturnValue({
      buscarRelatorio: mockBuscarRelatorio,
      buscarHistoricoDetalhado: mockBuscarHistoricoDetalhado,
      loading: false,
      error: null,
    });
  });

  it("deve renderizar os cards de resumo com os dados financeiros do backend", async () => {
    // Simulando o objeto que o Backend devolve
    mockBuscarRelatorio.mockResolvedValueOnce({
      resumoGeral: { totalArrecadado: 500, rifasPagas: 50, aderidosAtivos: 10 },
      aderidos: [],
    });
    mockBuscarHistoricoDetalhado.mockResolvedValueOnce([]);

    render(<VisaoGraficaTab />);

    // Verificamos os 3 cartões principais
    expect(await screen.findByText(/500/i)).toBeInTheDocument(); // O dinheiro
    expect(screen.getByText(/Caixa Validado/i)).toBeInTheDocument();
    expect(screen.getByText(/50 bilhetes/i)).toBeInTheDocument();
    expect(screen.getByText(/10 alunos/i)).toBeInTheDocument();
  });

  it("deve renderizar os títulos das seções dos gráficos na tela", async () => {
    mockBuscarRelatorio.mockResolvedValueOnce({
      resumoGeral: { totalArrecadado: 0, rifasPagas: 0, aderidosAtivos: 0 },
      aderidos: [],
    });
    mockBuscarHistoricoDetalhado.mockResolvedValueOnce([]);

    render(<VisaoGraficaTab />);

    // Verifica se a Dashboard está com os gráficos montados e rotulados
    expect(
      await screen.findByText(/Evolução do Faturamento/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Status de Pagamento/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Engajamento: Metas da Turma/i),
    ).toBeInTheDocument();
  });
});
