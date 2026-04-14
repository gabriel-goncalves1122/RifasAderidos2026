// ============================================================================
// ARQUIVO: frontend/tests/auditoria/AuditoriaTable.test.tsx
// ============================================================================
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuditoriaTable } from "../../src/views/components/tesouraria/AuditoriaTable";
import { useAuditoria } from "../../src/controllers/useAuditoria";

// Mock do hook useAuditoria
vi.mock("../../src/controllers/useAuditoria", () => ({
  useAuditoria: vi.fn(),
}));

// Mock para garantir que window.alert exista no ambiente JSDOM
window.alert = vi.fn();

describe("Componente <AuditoriaTable />", () => {
  const mockBuscarPendentes = vi.fn();
  const mockAvaliarComprovante = vi.fn();
  const mockAuditarEmLoteComIA = vi.fn();
  const mockSalvarExtratoCsv = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuditoria as any).mockReturnValue({
      buscarPendentes: mockBuscarPendentes,
      avaliarComprovante: mockAvaliarComprovante,
      auditarEmLoteComIA: mockAuditarEmLoteComIA,
      salvarExtratoCsv: mockSalvarExtratoCsv,
    });
  });

  it("Deve exibir 'Fila Limpa!' e KPIs zerados quando não houver rifas pendentes", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([]);

    render(<AuditoriaTable />);

    await waitFor(() => {
      expect(screen.getByText("Fila Limpa!")).toBeInTheDocument();
      const valTotal = screen.getAllByText("R$ 0,00");
      expect(valTotal.length).toBeGreaterThan(0);
    });
  });

  it("Deve calcular corretamente os valores nos cartões de resumo (KPIs no topo)", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([
      {
        numero: "001",
        status: "pendente",
        comprovante_url: "url1",
        IA_resultado: "APROVADO",
      },
      {
        numero: "002",
        status: "pendente",
        comprovante_url: "url2",
        IA_resultado: "DIVERGENTE",
      },
    ]);

    render(<AuditoriaTable />);

    await waitFor(() => {
      // 2 Rifas a 10 reais cada = 20 reais no total da fila
      expect(screen.getByText("R$ 20,00")).toBeInTheDocument();

      // O KPI de Aprovados deve ter 10 reais
      const aprovadosKPI = screen.getByText("Pré-Aprovados (IA)").parentElement;
      expect(aprovadosKPI).toHaveTextContent("R$ 10,00");

      // O KPI de Divergentes deve ter 10 reais
      const divergentesKPI =
        screen.getByText("Divergências (IA)").parentElement;
      expect(divergentesKPI).toHaveTextContent("R$ 10,00");
    });
  });

  it("Deve abrir o Modal de Confirmação ao clicar em Aprovar Pagamento", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([
      {
        numero: "001",
        status: "pendente",
        comprovante_url: "url1",
      },
    ]);

    render(<AuditoriaTable />);

    // Aguarda a tabela renderizar a transação
    await waitFor(() => {
      expect(screen.getByText("O QUE PROCURAR NA IMAGEM:")).toBeInTheDocument();
    });

    const botaoAprovar = screen.getByRole("button", {
      name: /Aprovar Pagamento/i,
    });

    fireEvent.click(botaoAprovar);

    // O modal abre, verificamos se os botões do modal existem (é mais seguro que o texto do título exato se este mudar)
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Sim, aprovar/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Cancelar/i }),
      ).toBeInTheDocument();
    });
  });

  describe("AuditoriaTable -> Upload de Extrato CSV", () => {
    it("Deve ler o arquivo CSV e enviá-lo via API (salvarExtratoCsv)", async () => {
      mockBuscarPendentes.mockResolvedValueOnce([]);
      mockSalvarExtratoCsv.mockResolvedValueOnce(true);

      const alertSpy = vi.spyOn(window, "alert");

      const { container } = render(<AuditoriaTable />);

      // Aguarda o componente carregar
      await waitFor(() => {
        expect(screen.getByText("Fila Limpa!")).toBeInTheDocument();
      });

      // 1. Simular a criação de um ficheiro CSV falso
      const arquivoCsvFalso = new File(
        ["DATA,VALOR,NOME\n01/01/2026,10.00,GABRIEL"],
        "extrato.csv",
        { type: "text/csv" },
      );

      // 2. Encontrar o input hidden
      const inputFicheiro = container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      expect(inputFicheiro).not.toBeNull();

      // 3. Simular o upload
      fireEvent.change(inputFicheiro, { target: { files: [arquivoCsvFalso] } });

      // 4. Esperar que o FileReader processe e chame a função da API e exiba o alert de sucesso
      await waitFor(() => {
        expect(mockSalvarExtratoCsv).toHaveBeenCalledWith(
          "DATA,VALOR,NOME\n01/01/2026,10.00,GABRIEL",
        );
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            "✅ Extrato da InfinitePay guardado na nuvem com sucesso!",
          ),
        );
      });
    });

    it("Deve mostrar o botão em estado de 'A carregar...' durante o upload", async () => {
      mockBuscarPendentes.mockResolvedValueOnce([]);

      // Simula uma resposta demorada para podermos ver o estado de "loading"
      let resolvePromise: (value: unknown) => void;
      const promiseLenta = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockSalvarExtratoCsv.mockReturnValueOnce(promiseLenta);

      const { container } = render(<AuditoriaTable />);

      await waitFor(() => {
        expect(screen.getByText("Fila Limpa!")).toBeInTheDocument();
      });

      const arquivoCsvFalso = new File(["teste"], "extrato.csv", {
        type: "text/csv",
      });
      const inputFicheiro = container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;

      fireEvent.change(inputFicheiro, { target: { files: [arquivoCsvFalso] } });

      // O texto deve mudar para "A carregar..." imediatamente
      await waitFor(() => {
        expect(screen.getByText("A carregar...")).toBeInTheDocument();
      });

      // Libera a promise para finalizar o teste de forma limpa
      resolvePromise!(true);
    });
  });
});
