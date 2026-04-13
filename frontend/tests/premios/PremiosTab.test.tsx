import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PremiosTab } from "../../src/views/components/premios/PremiosTab";
import { usePremios } from "../../src/controllers/usePremios"; // <-- Novo Controller

// Mock do Controller
vi.mock("../../src/controllers/usePremios", () => ({
  usePremios: vi.fn(),
}));

describe("Componente: PremiosTab", () => {
  const mockBuscarPremios = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Sem vi.mocked!
    (usePremios as any).mockReturnValue({
      buscarPremios: mockBuscarPremios,
    });
  });

  it("deve renderizar a vitrine para o aderido comum (sem botões de edição)", async () => {
    // Simulando o retorno do Banco de Dados
    mockBuscarPremios.mockResolvedValueOnce({
      infoSorteio: {
        titulo: "Sorteio Teste",
        data: "2026-12-20",
        descricao: "Descricao Teste",
      },
      premios: [
        {
          id: "1",
          colocacao: "1º Lugar",
          titulo: "Carro",
          descricao: "Zero KM",
          imagem_url: "",
        },
      ],
    });

    // Renderiza como Usuário Comum (isAdmin = false)
    render(<PremiosTab isAdmin={false} />);

    // Verifica se os dados renderizaram
    expect(await screen.findByText("Sorteio Teste")).toBeInTheDocument();
    expect(screen.getByText("1º Lugar")).toBeInTheDocument();
    expect(screen.getByText("Carro")).toBeInTheDocument();

    // VALIDAÇÃO DE SEGURANÇA: Verifica se o botão de adicionar prêmio NÃO está na tela
    expect(screen.queryByText("Adicionar Prêmio")).not.toBeInTheDocument();
  });

  it("deve renderizar os botões de edição para a tesouraria (Admin)", async () => {
    mockBuscarPremios.mockResolvedValueOnce({
      infoSorteio: {
        titulo: "Sorteio Admin",
        data: "2026-12-20",
        descricao: "...",
      },
      premios: [],
    });

    // Renderiza como Admin (isAdmin = true)
    render(<PremiosTab isAdmin={true} />);

    expect(await screen.findByText("Sorteio Admin")).toBeInTheDocument();

    // VALIDAÇÃO DE SEGURANÇA: Verifica se o botão do Admin apareceu
    expect(screen.getByText("Novo Prêmio")).toBeInTheDocument();
  });

  it("deve exibir estado vazio se não houver prêmios cadastrados", async () => {
    mockBuscarPremios.mockResolvedValueOnce({
      infoSorteio: { titulo: "Sorteio Vazio", data: "", descricao: "" },
      premios: [],
    });

    render(<PremiosTab isAdmin={false} />);

    expect(
      await screen.findByText(/Nenhum prêmio anunciado ainda/i),
    ).toBeInTheDocument();
  });
});
