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
    localStorage.clear();
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

  it("Deve buscar rifas e notificacoes com cache por usuario", async () => {
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

  it("Deve filtrar dados invalidos da API (validacao runtime)", async () => {
    mocks.buscarMinhasRifas.mockResolvedValueOnce([
      { numero: "001", status: "disponivel" },
      { status: "sem-numero" },
      { numero: "002" },
      null,
      "invalido",
    ]);

    mocks.buscarNotificacoes.mockResolvedValueOnce([
      { id: "NOT_001", titulo: "ok", mensagem: "ok", lida: false },
      { titulo: "sem-id", mensagem: "x" },
      "invalido",
    ]);

    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.minhasRifas).toHaveLength(1);
      expect(result.current.notificacoes).toHaveLength(1);
    });

    expect(result.current.minhasRifas[0].numero).toBe("001");
    expect(result.current.notificacoes[0].id).toBe("NOT_001");
  });

  it("Deve retornar array vazio se API retornar objeto invalido", async () => {
    mocks.buscarMinhasRifas.mockResolvedValueOnce(null);
    mocks.buscarNotificacoes.mockResolvedValueOnce({ nao: "array" });

    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.minhasRifas).toEqual([]);
    expect(result.current.notificacoes).toEqual([]);
  });

  it("Deve marcar notificacoes como lidas de forma otimista", async () => {
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

  it("Nao deve marcar IDs que nao pertencem ao usuario", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.notificacoes).toHaveLength(1);
    });

    await act(async () => {
      await result.current.marcarNotificacoesLidasOtimista([
        "NOT_INEXISTENTE",
      ]);
    });

    expect(mocks.marcarNotificacoesLidas).not.toHaveBeenCalled();
  });

  it("Nao deve fazer nada se lista de IDs vazia", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      await result.current.marcarNotificacoesLidasOtimista([]);
    });

    expect(mocks.marcarNotificacoesLidas).not.toHaveBeenCalled();
  });

  it("Deve sanitizar dados de correcao antes de enviar ao backend", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      await result.current.corrigirDadosRecusados(["003"], {
        nome: "  Ana Beatriz  ",
        email: "ana@email.com",
        telefone: "(35) 99999-9999",
      });
    });

    // Nome deve ser trimmed, telefone deve ter apenas digitos
    expect(mocks.corrigirDadosRifasRecusadas).toHaveBeenCalledWith({
      numerosRifas: ["003"],
      nome: "Ana Beatriz",
      email: "ana@email.com",
      telefone: "35999999999",
    });
  });

  it("Deve limpar email invalido durante a sanitizacao de correcao", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      await result.current.corrigirDadosRecusados(["004"], {
        nome: "Carlos",
        email: "email-sem-arroba",
        telefone: "11999998888",
      });
    });

    expect(mocks.corrigirDadosRifasRecusadas).toHaveBeenCalledWith({
      numerosRifas: ["004"],
      nome: "Carlos",
      email: "",
      telefone: "11999998888",
    });
  });

  it("Deve limitar tamanho dos campos na sanitizacao", async () => {
    const { result } = renderHook(() => useRifasData(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    const nomeGrande = "A".repeat(300);
    const telefoneGrande = "1".repeat(50);

    await act(async () => {
      await result.current.corrigirDadosRecusados(["005"], {
        nome: nomeGrande,
        email: "teste@teste.com",
        telefone: telefoneGrande,
      });
    });

    const chamada = mocks.corrigirDadosRifasRecusadas.mock.calls[0][0];
    expect(chamada.nome.length).toBe(120);
    expect(chamada.telefone.length).toBe(20);
  });
});
