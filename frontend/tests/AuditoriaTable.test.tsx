// ============================================================================
// ARQUIVO: frontend/tests/AuditoriaTable.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuditoriaTable } from "../src/views/components/AuditoriaTable";
import { useAuditoria } from "../src/controllers/useAuditoria";

// MOCK: Corta a conexão com o banco para testar apenas a interface visual
vi.mock("../src/controllers/useAuditoria", () => ({
  useAuditoria: vi.fn(),
}));

const mockBuscarPendentes = vi.fn();
const mockAvaliarComprovante = vi.fn();
const mockAuditarEmLoteComIA = vi.fn();

describe("Componente <AuditoriaTable />", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAuditoria as any).mockReturnValue({
      buscarPendentes: mockBuscarPendentes,
      avaliarComprovante: mockAvaliarComprovante,
      auditarEmLoteComIA: mockAuditarEmLoteComIA,
      loading: false,
    });
  });

  // ========================================================================
  // TESTE 1: Feedback Visual (Fila Vazia)
  // ========================================================================
  it("Deve exibir 'Fila Limpa!' e KPIs zerados quando não houver rifas pendentes", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([]); // Retorna array vazio do banco
    render(<AuditoriaTable />);

    expect(await screen.findByText("Fila Limpa!")).toBeInTheDocument();

    // Como não há rifas, o painel financeiro deve mostrar R$ 0,00
    const valoresZerados = screen.getAllByText("R$ 0,00");
    expect(valoresZerados.length).toBeGreaterThanOrEqual(3); // Total, Aprovados e Divergentes
  });

  // ========================================================================
  // TESTE 2: Painel de Controle (Matemática dos KPIs)
  // ========================================================================
  it("Deve calcular corretamente os valores nos cartões de resumo (KPIs no topo)", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([
      // Transação 1: 2 Rifas Normais (R$ 20,00) -> Ainda não auditadas
      {
        numero: "001",
        status: "pendente",
        comprovante_url: "http://pix.com/1",
      },
      {
        numero: "002",
        status: "pendente",
        comprovante_url: "http://pix.com/1",
      },

      // Transação 2: 1 Rifa (R$ 10,00) -> Pré-Aprovada pela IA
      {
        numero: "003",
        status: "pendente",
        comprovante_url: "http://pix.com/2",
        IA_resultado: "APROVADO",
      },

      // Transação 3: 1 Rifa (R$ 10,00) -> Divergência encontrada pela IA
      {
        numero: "004",
        status: "pendente",
        comprovante_url: "http://pix.com/3",
        IA_resultado: "DIVERGENTE",
      },
    ]);

    render(<AuditoriaTable />);

    // Espera a tabela carregar os dados
    await screen.findByText("001");

    // O "Total na Fila" deve ser R$ 40,00 (20 + 10 + 10)
    expect(screen.getByText("R$ 40,00")).toBeInTheDocument();

    // Como há 1 aprovada e 1 divergente de R$10 cada, o valor de R$ 10,00 deve aparecer nos cards
    const valoresDez = screen.getAllByText("R$ 10,00");
    expect(valoresDez.length).toBeGreaterThanOrEqual(2);

    // Verifica os contadores de transações
    expect(screen.getByText("3 transações pendentes")).toBeInTheDocument();
    expect(screen.getByText("1 transações validadas")).toBeInTheDocument();
    expect(screen.getByText("1 transações com alerta")).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 3: Interação de Aprovação Segura
  // ========================================================================
  it("Deve abrir o Modal de Confirmação ao clicar em Aprovar Pagamento", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([
      {
        numero: "045",
        status: "pendente",
        comprovante_url: "http://pix.com/2",
        vendedor_cpf: "222",
      },
    ]);

    render(<AuditoriaTable />);

    // Procura o botão de aprovação (agora com o texto atualizado)
    const btnAprovar = await screen.findByRole("button", {
      name: /Aprovar Pagamento/i,
    });
    fireEvent.click(btnAprovar);

    // Garante que a ação não vá direto para o backend. O Modal de segurança deve aparecer.
    // Usamos um regex mais abrangente caso o texto exato do seu modal mude.
    expect(await screen.findByText(/Confirmar/i)).toBeInTheDocument();
  });
});
