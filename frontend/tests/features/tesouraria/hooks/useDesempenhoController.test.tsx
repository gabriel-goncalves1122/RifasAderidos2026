import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { useDesempenhoController } from "@/features/tesouraria/hooks/useDesempenhoController";
import { desempenhoService } from "@/features/tesouraria/services/desempenhoService";

vi.mock("@/features/tesouraria/services/desempenhoService", () => ({
  desempenhoService: {
    buscarRelatorio: vi.fn(),
    buscarHistoricoDetalhado: vi.fn(),
  },
}));

describe("Hook-controller: useDesempenhoController", () => {
  const criarWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(desempenhoService.buscarRelatorio).mockResolvedValue({
      resumoGeral: { totalArrecadado: 0, rifasPagas: 0, aderidosAtivos: 0 },
      aderidos: [],
    });
    vi.mocked(desempenhoService.buscarHistoricoDetalhado).mockResolvedValue([]);
  });

  it("Deve carregar relatório e histórico para montar os dados da aba", async () => {
    vi.mocked(desempenhoService.buscarRelatorio).mockResolvedValueOnce({
      resumoGeral: { totalArrecadado: 500, rifasPagas: 50, aderidosAtivos: 10 },
      aderidos: [{ arrecadado: 150, meta: 100 }],
    });
    vi.mocked(desempenhoService.buscarHistoricoDetalhado).mockResolvedValueOnce([
      { status: "pago", data_reserva: "2026-05-01", valor: 500 },
      { status: "pendente", data_reserva: "2026-05-02", valor: 10 },
    ]);

    const { result } = renderHook(() => useDesempenhoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(desempenhoService.buscarRelatorio).toHaveBeenCalledTimes(1);
    expect(desempenhoService.buscarHistoricoDetalhado).toHaveBeenCalledTimes(1);
    expect(result.current.erro).toBeNull();
    expect(result.current.dados.resumoGeral.totalArrecadado).toBe(500);
    expect(result.current.dados.status.pagas).toBe(1);
    expect(result.current.dados.status.pendentes).toBe(1);
    expect(result.current.dados.metas.bateramMeta).toBe(1);
  });

  it("Deve manter fallback vazio e expor erro quando uma chamada falhar", async () => {
    vi.mocked(desempenhoService.buscarRelatorio).mockRejectedValueOnce(
      new Error("Relatório indisponível"),
    );
    vi.mocked(desempenhoService.buscarHistoricoDetalhado).mockRejectedValueOnce(
      new Error("Histórico indisponível"),
    );

    const { result } = renderHook(() => useDesempenhoController(), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.erro).toBe("Erro ao carregar dados de desempenho.");
    expect(result.current.dados.resumoGeral.totalArrecadado).toBe(0);
    expect(result.current.dados.metas.total).toBe(0);
  });
});
