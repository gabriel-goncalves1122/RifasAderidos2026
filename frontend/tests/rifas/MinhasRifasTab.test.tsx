// ============================================================================
// ARQUIVO: frontend/tests/aderidos/MinhasRifasTab.test.tsx
// ============================================================================
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MinhasRifasTab } from "../../src/views/components/aderidos/MinhasRifasTab";

// 1. Simular (Mock) as chamadas aos Controllers
vi.mock("../../src/controllers/useRifas", () => ({
  useRifas: () => ({
    buscarMinhasRifas: vi.fn().mockResolvedValue([
      { numero: "001", status: "disponivel" },
      {
        numero: "002",
        status: "recusado",
        comprador_nome: "João",
        motivo_recusa: "Falso",
        data_reserva: "2026-04-19T10:00:00Z",
      },
    ]),
    corrigirRifasRecusadas: vi.fn().mockResolvedValue(true),
  }),
}));

vi.mock("../../src/controllers/useNotificacoes", () => ({
  useNotificacoes: () => ({
    buscarNotificacoes: vi
      .fn()
      .mockResolvedValue([{ id: "1", lida: false, texto: "Aviso" }]),
    marcarNotificacoesLidas: vi.fn(),
  }),
}));

vi.mock("../../src/controllers/useAuthController", () => ({
  useAuthController: () => ({
    usuarioAtual: { nome: "Gabriel Gonçalves" }, // Nome do utilizador logado
  }),
}));

describe("Componente: MinhasRifasTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve mostrar o ícone de carregamento ao inicializar", () => {
    render(<MinhasRifasTab />);
    // O CircularProgress do Material-UI tem o role 'progressbar'
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("Deve carregar os dados e exibir as estatísticas com o nome do utilizador", async () => {
    render(<MinhasRifasTab />);

    // Aguarda o spinner desaparecer e renderizar as informações
    await waitFor(() => {
      // Verifica se o nome foi extraído corretamente (apenas o primeiro nome "Gabriel")
      expect(screen.getByText("Olá, Gabriel!")).toBeInTheDocument();
      // O botão "Ver Rifas Negadas" deve aparecer, pois injetamos a rifa "002" como recusada
      expect(
        screen.getByRole("button", { name: /Ver Rifas Negadas/i }),
      ).toBeInTheDocument();
    });
  });

  it("Deve trocar de aba para 'AbaRecusadas' ao clicar em 'Ver Rifas Negadas'", async () => {
    render(<MinhasRifasTab />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Ver Rifas Negadas/i }),
      ).toBeInTheDocument();
    });

    const btnVerNegadas = screen.getByRole("button", {
      name: /Ver Rifas Negadas/i,
    });
    fireEvent.click(btnVerNegadas);

    // O título da Aba Recusadas deve aparecer na tela
    expect(
      screen.getByText(/Vendas Negadas pela Tesouraria/i),
    ).toBeInTheDocument();

    // O botão da visão "Geral" já não deve estar visível
    expect(screen.queryByText("Bloco de Vendas")).not.toBeInTheDocument();
  });

  it("Deve abrir o modal de Carrinho ao selecionar uma rifa e clicar em Vender", async () => {
    render(<MinhasRifasTab />);

    await waitFor(() => {
      // Espera as rifas carregarem
      expect(screen.getByText("001")).toBeInTheDocument();
    });

    // Clica na rifa "001" (que está disponível no mock)
    fireEvent.click(screen.getByText("001"));

    // Como selecionou, o carrinho flutuante deve aparecer.
    // Vamos buscar o botão de finalizar venda do carrinho
    const btnVenderCarrinho = screen.getByRole("button", { name: /Vender/i });
    expect(btnVenderCarrinho).toBeInTheDocument();

    // Clica no botão Vender do carrinho
    fireEvent.click(btnVenderCarrinho);

    // O modal de Checkout deve ter sido aberto. Verificamos se o título dele apareceu
    expect(screen.getByText(/Finalizar Venda/i)).toBeInTheDocument();
  });
});
