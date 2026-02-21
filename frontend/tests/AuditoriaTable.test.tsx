// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/AuditoriaTable.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuditoriaTable } from "../src/views/components/AuditoriaTable";
import { useRifasController } from "../src/controllers/useRifasController";

// MOCK: Corta a conexão com o banco para testar apenas a interface visual
vi.mock("../src/controllers/useRifasController", () => ({
  useRifasController: vi.fn(),
}));

const mockBuscarPendentes = vi.fn();
const mockAvaliarComprovante = vi.fn();

describe("Componente <AuditoriaTable />", () => {
  beforeEach(() => {
    vi.mocked(useRifasController).mockReturnValue({
      buscarPendentes: mockBuscarPendentes,
      avaliarComprovante: mockAvaliarComprovante,
      loading: false,
      buscarMinhasRifas: vi.fn(),
      finalizarVenda: vi.fn(),
      buscarRelatorio: vi.fn(),
      error: null,
    });
    vi.clearAllMocks();
  });

  // TESTE 1: Feedback Visual quando não há trabalho a fazer
  it("Deve exibir 'Tudo limpo!' quando não houver rifas pendentes", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([]); // Retorna array vazio do banco

    render(<AuditoriaTable />);

    // Garante que a mensagem de alívio para a tesouraria seja exibida
    expect(await screen.findByText("Tudo limpo!")).toBeInTheDocument();
    expect(
      screen.getByText("Não há comprovantes pendentes de auditoria."),
    ).toBeInTheDocument();
  });

  // TESTE 2: A Mágica do Agrupamento (Várias rifas num pix só)
  it("Deve agrupar rifas com o mesmo comprovante e calcular o valor correto", async () => {
    // Simulando o recebimento de 3 rifas com EXATAMENTE O MESMO link do pix
    mockBuscarPendentes.mockResolvedValueOnce([
      {
        numero: "001",
        status: "pendente",
        comprovante_url: "http://pix.com/1",
        vendedor_cpf: "111",
      },
      {
        numero: "002",
        status: "pendente",
        comprovante_url: "http://pix.com/1",
        vendedor_cpf: "111",
      },
      {
        numero: "003",
        status: "pendente",
        comprovante_url: "http://pix.com/1",
        vendedor_cpf: "111",
      },
    ]);

    render(<AuditoriaTable />);

    // Verificação Matemática: A tabela deve multiplicar 3 rifas x R$ 10,00 e mostrar 30,00
    const valorEsperado = await screen.findByText(/30,00/i);
    expect(valorEsperado).toBeInTheDocument();

    // Verificação Visual: As três rifas devem estar agrupadas em chips na tela
    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("002")).toBeInTheDocument();
    expect(screen.getByText("003")).toBeInTheDocument();
  });

  // TESTE 3: Interação e Proteção contra erro humano
  it("Deve abrir o Modal Animado ao clicar em Aprovar", async () => {
    mockBuscarPendentes.mockResolvedValueOnce([
      {
        numero: "045",
        status: "pendente",
        comprovante_url: "http://pix.com/2",
        vendedor_cpf: "222",
      },
    ]);

    render(<AuditoriaTable />);

    // Procura o botão de aprovação real e "clica" nele
    const btnAprovar = await screen.findByRole("button", { name: /aprovar/i });
    fireEvent.click(btnAprovar);

    // Garante que a ação não vá direto para o backend. O Modal de segurança deve aparecer.
    expect(await screen.findByText(/Confirmar Aprovação/i)).toBeInTheDocument();

    // Novo texto que configuramos nos cards para mobile
    expect(screen.getByText(/Você está prestes a/i)).toBeInTheDocument();
  });
});
