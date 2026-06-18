// ============================================================================
// ARQUIVO: frontend/tests/features/aderidos/hooks/usePainelAderido.test.tsx
// ============================================================================
import { PropsWithChildren } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  buscarMinhasRifas: vi.fn(),
  corrigirDadosRifasRecusadas: vi.fn(),

  buscarNotificacoes: vi.fn(),
  marcarNotificacoesLidas: vi.fn(),

  usuarioAtual: {
    uid: "USER_001",
    nome: "Gabriel Sampaio",
    displayName: "Gabriel Sampaio",
    email: "gabriel@email.com",
  },
}));

vi.mock("@/features/aderidos/services/aderidoRifaService", () => ({
  aderidoRifaService: {
    buscarMinhasRifas: mocks.buscarMinhasRifas,
    corrigirDadosRifasRecusadas: mocks.corrigirDadosRifasRecusadas,
  },
}));

vi.mock("@/shared/hooks/useNotificacoes", () => ({
  useNotificacoes: () => ({
    buscarNotificacoes: mocks.buscarNotificacoes,
    marcarNotificacoesLidas: mocks.marcarNotificacoesLidas,
  }),
}));

vi.mock("@/features/auth/hooks/useAuthController", () => ({
  useAuthController: () => ({
    usuarioAtual: mocks.usuarioAtual,
    loading: false,
  }),
}));

import { usePainelAderidoController } from "@/features/aderidos/hooks/usePainelAderidoController";

const rifasMock = [
  {
    numero: "001",
    status: "disponivel",
    vendedor_nome: "Gabriel Sampaio",
  },
  {
    numero: "002",
    status: "pago",
    vendedor_nome: "Gabriel Sampaio",
  },
  {
    numero: "003",
    status: "recusado",
    vendedor_nome: "Gabriel Sampaio",
    comprador_nome: "Ana",
    comprador_email: "ana@email.com",
    comprador_telefone: "(35) 99999-9999",
    data_pagamento: "2026-05-01",
    motivo_recusa: "Comprovante ilegivel",
  },
];

const notificacoesMock = [
  {
    id: "NOT_001",
    titulo: "Aviso",
    mensagem: "Mensagem de teste",
    lida: false,
  },
];

function criarQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60_000,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function criarWrapper(queryClient = criarQueryClient()) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("Hook: usePainelAderidoController", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.buscarMinhasRifas.mockResolvedValue(rifasMock);
    mocks.buscarNotificacoes.mockResolvedValue(notificacoesMock);
    mocks.marcarNotificacoesLidas.mockResolvedValue(undefined);
    mocks.corrigirDadosRifasRecusadas.mockResolvedValue(true);
  });

  it("Deve buscar rifas e notificacoes ao inicializar o painel", async () => {
    renderHook(() => usePainelAderidoController(), { wrapper: criarWrapper() });

    await waitFor(() => {
      expect(mocks.buscarMinhasRifas).toHaveBeenCalledTimes(1);
      expect(mocks.buscarNotificacoes).toHaveBeenCalledTimes(1);
    });
  });

  it("Deve montar o primeiro nome do usuario logado", async () => {
    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.primeiroNome).toBe("Gabriel");
  });

  it("Deve usar email do proprio usuario quando nao houver nome", async () => {
    mocks.usuarioAtual = {
      uid: "USER_002",
      nome: null,
      displayName: null,
      email: "joao@email.com",
    };

    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.primeiroNome).toBe("joao");
  });

  it("Deve armazenar as rifas retornadas pelo hook de rifas", async () => {
    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(3);
    });

    expect(result.current.minhasRifas[0].numero).toBe("001");
    expect(result.current.notificacoes).toHaveLength(1);
    expect(result.current.contadoresRifas).toMatchObject({
      todas: 3,
      disponivel: 1,
      pago: 1,
      recusado: 1,
    });
  });

  it("Deve selecionar e remover uma rifa disponivel da selecao", async () => {
    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(3);
    });

    act(() => {
      result.current.alternarSelecaoRifa("001", "disponivel");
    });

    expect(result.current.selecionadas).toEqual(["001"]);

    act(() => {
      result.current.alternarSelecaoRifa("001", "disponivel");
    });

    expect(result.current.selecionadas).toEqual([]);
  });

  it("Nao deve selecionar rifas que nao estejam disponiveis", async () => {
    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(3);
    });

    act(() => {
      result.current.alternarSelecaoRifa("002", "pago");
    });

    act(() => {
      result.current.alternarSelecaoRifa("003", "recusado");
    });

    expect(result.current.selecionadas).toEqual([]);
  });

  it("Deve corrigir dados de rifas recusadas e recarregar o painel", async () => {
    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      const sucesso = await result.current.corrigirDadosRecusados(["003"], {
        nome: "Ana",
        email: "ana@email.com",
        telefone: "(35) 99999-9999",
      });

      expect(sucesso).toBe(true);
    });

    // Telefone agora e sanitizado (remove nao-digitos) pelo useRifasData
    expect(mocks.corrigirDadosRifasRecusadas).toHaveBeenCalledWith({
      numerosRifas: ["003"],
      nome: "Ana",
      email: "ana@email.com",
      telefone: "35999999999",
    });
    expect(mocks.buscarMinhasRifas).toHaveBeenCalledTimes(2);
  });

  it("Deve marcar notificacoes como lidas de forma otimista", async () => {
    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.notificacoesNaoLidas).toBe(1);
    });

    await act(async () => {
      await result.current.abrirSidebarNotificacoes();
    });

    expect(mocks.marcarNotificacoesLidas).toHaveBeenCalledWith(["NOT_001"]);
    expect(result.current.drawerNotificacoesAberto).toBe(true);
    expect(result.current.notificacoesNaoLidas).toBe(0);
  });

  it("Deve reaproveitar rifas e notificacoes em cache para o mesmo usuario", async () => {
    const queryClient = criarQueryClient();
    const wrapper = criarWrapper(queryClient);

    const primeiraRenderizacao = renderHook(() => usePainelAderidoController(), {
      wrapper,
    });

    await waitFor(() => {
      expect(primeiraRenderizacao.result.current.minhasRifas).toHaveLength(3);
    });

    primeiraRenderizacao.unmount();

    const segundaRenderizacao = renderHook(() => usePainelAderidoController(), {
      wrapper,
    });

    expect(segundaRenderizacao.result.current.minhasRifas).toHaveLength(3);
    expect(mocks.buscarMinhasRifas).toHaveBeenCalledTimes(1);
    expect(mocks.buscarNotificacoes).toHaveBeenCalledTimes(1);
  });

  it("Deve manter a tela renderizavel quando a busca de rifas falhar", async () => {
    mocks.buscarMinhasRifas.mockRejectedValueOnce(new Error("API indisponivel"));

    const { result } = renderHook(() => usePainelAderidoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.minhasRifas).toEqual([]);
    expect(result.current.rifasFiltradas).toEqual([]);
  });
});
