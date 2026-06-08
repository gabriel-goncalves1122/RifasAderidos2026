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
    email: "aderido@teste.com",
  },
}));

vi.mock("@/features/rifas/hooks/useRifas", () => ({
  useRifas: () => ({
    buscarMinhasRifas: mocks.buscarMinhasRifas,
    corrigirDadosRifasRecusadas: mocks.corrigirDadosRifasRecusadas,
  }),
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

import { useRifasData } from "@/features/aderidos/hooks/useRifasData";

function criarQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60_000,
        gcTime: Infinity,
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

describe("Hook: useRifasData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.buscarMinhasRifas.mockResolvedValue([
      { numero: "001", status: "disponivel" },
    ]);
    mocks.buscarNotificacoes.mockResolvedValue([
      { id: "NOT_001", titulo: "Aviso", mensagem: "Teste", lida: false },
    ]);
    mocks.marcarNotificacoesLidas.mockResolvedValue(undefined);
    mocks.corrigirDadosRifasRecusadas.mockResolvedValue(true);
  });

  it("Deve buscar rifas e notificações com cache por usuário", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(1);
      expect(result.current.notificacoes).toHaveLength(1);
    });

    expect(mocks.buscarMinhasRifas).toHaveBeenCalledTimes(1);
    expect(mocks.buscarNotificacoes).toHaveBeenCalledTimes(1);
  });

  it("Deve marcar notificações como lidas de forma otimista", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.notificacoes[0].lida).toBe(false);
    });

    await act(async () => {
      await result.current.marcarNotificacoesLidasOtimista(["NOT_001"]);
    });

    expect(mocks.marcarNotificacoesLidas).toHaveBeenCalledWith(["NOT_001"]);
    await waitFor(() => {
      expect(result.current.notificacoes[0].lida).toBe(true);
    });
  });

  it("Deve delegar correção de dados recusados para o hook de rifas", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      await result.current.corrigirDadosRecusados(["003"], {
        nome: "Ana",
        email: "ana@email.com",
        telefone: "(35) 99999-9999",
      });
    });

    expect(mocks.corrigirDadosRifasRecusadas).toHaveBeenCalledWith(["003"], {
      nome: "Ana",
      email: "ana@email.com",
      telefone: "(35) 99999-9999",
    });
  });
});
