// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/MinhasRifasTab.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { MinhasRifasTab } from "@/features/aderidos/MinhasRifasTab";
import { usePainelAderidoController } from "@/features/aderidos/hooks/usePainelAderidoController";

vi.mock("@/features/aderidos/hooks/usePainelAderidoController", () => ({
  usePainelAderidoController: vi.fn(),
}));

vi.mock("@/shared/components/NotificacoesSidebar", () => ({
  NotificacoesSidebar: ({ open }: { open: boolean }) =>
    open ? <div>Sidebar de notificações</div> : null,
}));

function criarPainelMock(
  overrides: Partial<ReturnType<typeof usePainelAderidoController>> = {},
) {
  return {
    carregando: false,
    visaoAtual: "geral",
    filtro: "todas",
    selecionadas: [],

    minhasRifas: [],
    rifasFiltradas: [
      {
        numero: "001",
        status: "disponivel",
      },
      {
        numero: "002",
        status: "pago",
        comprador_nome: "Ana Beatriz",
      },
    ],
    gruposRecusados: [],
    notificacoes: [],

    primeiroNome: "Gabriel",
    valorArrecadado: 10,
    contadoresRifas: {
      todas: 2,
      disponivel: 1,
      reservado: 0,
      pendente: 0,
      pago: 1,
      recusado: 0,
    },
    notificacoesNaoLidas: 0,

    modalCheckoutAberto: false,
    drawerNotificacoesAberto: false,
    modalCorrecaoAberto: false,
    grupoParaCorrigir: null,
    rifaParaDetalhes: null,

    setFiltro: vi.fn(),
    setVisaoAtual: vi.fn(),
    setModalCheckoutAberto: vi.fn(),
    setDrawerNotificacoesAberto: vi.fn(),
    setModalCorrecaoAberto: vi.fn(),
    setGrupoParaCorrigir: vi.fn(),
    setRifaParaDetalhes: vi.fn(),

    abrirSidebarNotificacoes: vi.fn(),
    abrirRecusadas: vi.fn(),
    voltarParaRifas: vi.fn(),
    alternarSelecaoRifa: vi.fn(),
    finalizarVendaComSucesso: vi.fn(),
    corrigirDadosRecusados: vi.fn(),

    ...overrides,
  } as any;
}

describe("Componente <MinhasRifasTab />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve exibir carregamento enquanto busca os dados", () => {
    vi.mocked(usePainelAderidoController).mockReturnValue(
      criarPainelMock({
        carregando: true,
      }),
    );

    render(<MinhasRifasTab />);

    expect(screen.getByText(/Carregando suas rifas/i)).toBeInTheDocument();
  });

  it("Deve renderizar resumo e grelha de rifas na visão geral", () => {
    vi.mocked(usePainelAderidoController).mockReturnValue(criarPainelMock());

    render(<MinhasRifasTab />);

    expect(screen.getByTestId("aderidos-swipe-transition")).toHaveAttribute(
      "data-visao",
      "geral",
    );
    expect(screen.getByText(/Olá, Gabriel/i)).toBeInTheDocument();
    expect(screen.getByText(/Suas rifas/i)).toBeInTheDocument();
    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("002")).toBeInTheDocument();
  });

  it("Deve chamar seleção ao clicar em rifa disponível", () => {
    const mockAlternarSelecao = vi.fn();

    vi.mocked(usePainelAderidoController).mockReturnValue(
      criarPainelMock({
        alternarSelecaoRifa: mockAlternarSelecao,
      }),
    );

    render(<MinhasRifasTab />);

    fireEvent.click(screen.getByText("001"));

    expect(mockAlternarSelecao).toHaveBeenCalledWith("001", "disponivel");
  });

  it("Deve renderizar a aba de recusadas quando a visão atual for recusadas", () => {
    vi.mocked(usePainelAderidoController).mockReturnValue(
      criarPainelMock({
        visaoAtual: "recusadas",
        gruposRecusados: [
          {
            comprador: "Ana",
            email: "ana@email.com",
            telefone: "(11) 99999-9999",
            data: "2026-05-10T10:00:00.000Z",
            motivo: "Comprovante ilegível",
            bilhetes: ["001", "002"],
          },
        ],
      }),
    );

    render(<MinhasRifasTab />);

    expect(screen.getByTestId("aderidos-swipe-transition")).toHaveAttribute(
      "data-visao",
      "recusadas",
    );
    expect(screen.getByText(/Comprovante ilegível/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Voltar às rifas/i })).toBeInTheDocument();
    expect(screen.queryByText(/Olá, Gabriel/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Suas rifas/i)).not.toBeInTheDocument();
  });
});
