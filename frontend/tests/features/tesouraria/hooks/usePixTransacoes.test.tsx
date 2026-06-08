import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePixTransacoes } from "@/features/tesouraria/hooks/usePixTransacoes";
import { pixTransacoesMock } from "@/features/tesouraria/mocks/pixTransacoesMock";
import { pixTransacoesService } from "@/features/tesouraria/services/pixTransacoesService";
import {
  PixTransacoesResumo,
  PixTransacao,
} from "@/features/tesouraria/types/pixTransacoes";
import { RESUMO_PIX_TRANSACOES_VAZIO } from "@/features/tesouraria/utils/pixTransacoesUtils";

vi.mock("@/features/tesouraria/services/pixTransacoesService", () => ({
  pixTransacoesService: {
    buscarTransacoes: vi.fn(),
    buscarResumo: vi.fn(),
    sincronizarBanco: vi.fn(),
  },
}));

function criarTransacao(
  parcial: Partial<PixTransacao>,
): PixTransacao {
  return {
    id: parcial.id || "tx_teste",
    referenceId: parcial.referenceId || "ref_teste",
    metodo: "PIX",
    statusPagamento: parcial.statusPagamento || "PAID",
    statusConciliacao: parcial.statusConciliacao || "conciliada",
    valorBruto: parcial.valorBruto ?? 10,
    valorPago: parcial.valorPago ?? 10,
    moeda: "BRL",
    dataCriacao: parcial.dataCriacao || "2026-10-01T10:00:00.000-03:00",
    ...parcial,
  };
}

const resumoApi: PixTransacoesResumo = {
  totalRecebido: 99,
  totalPendente: 10,
  totalCancelado: 0,
  totalDivergente: 0,
  quantidadePagas: 3,
  quantidadeAguardando: 1,
  quantidadeCanceladas: 0,
  quantidadeNaoIdentificadas: 0,
  quantidadeAguardandoValidacao: 1,
  quantidadeAceitas: 0,
  quantidadeNegadas: 0,
  quantidadeSemConfirmacaoBancaria: 0,
  quantidadeComRifas: 0,
  quantidadeSemVinculo: 1,
  ticketMedio: 33,
};

describe("Hook: usePixTransacoes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValue([]);
    vi.mocked(pixTransacoesService.buscarResumo).mockResolvedValue(
      RESUMO_PIX_TRANSACOES_VAZIO,
    );
    vi.mocked(pixTransacoesService.sincronizarBanco).mockResolvedValue({
      sucesso: true,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("Deve carregar transações e resumo reais quando a API responder", async () => {
    const transacoes = [criarTransacao({ id: "tx_real", valorPago: 45 })];
    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValueOnce(
      transacoes,
    );
    vi.mocked(pixTransacoesService.buscarResumo).mockResolvedValueOnce(
      resumoApi,
    );

    const { result } = renderHook(() => usePixTransacoes());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.transacoes).toEqual(transacoes);
    expect(result.current.resumo).toEqual(resumoApi);
  });

  it("Deve calcular resumo local quando o resumo da API falhar", async () => {
    const transacoes = [
      criarTransacao({ id: "tx_paga", valorPago: 50, valorBruto: 50 }),
      criarTransacao({
        id: "tx_pendente",
        statusPagamento: "WAITING",
        valorBruto: 40,
        valorPago: 0,
      }),
    ];

    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValueOnce(
      transacoes,
    );
    vi.mocked(pixTransacoesService.buscarResumo).mockRejectedValueOnce(
      new Error("Resumo indisponível"),
    );

    const { result } = renderHook(() => usePixTransacoes());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.transacoes).toEqual(transacoes);
    expect(result.current.resumo.totalRecebido).toBe(50);
    expect(result.current.resumo.totalPendente).toBe(40);
    expect(result.current.resumo.quantidadePagas).toBe(1);
    expect(result.current.resumo.quantidadeAguardando).toBe(1);
  });

  it("Deve calcular resumo local quando a API retornar resumo vazio", async () => {
    const transacoes = [
      criarTransacao({ id: "tx_paga", valorPago: 25, valorBruto: 25 }),
    ];

    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValueOnce(
      transacoes,
    );
    vi.mocked(pixTransacoesService.buscarResumo).mockResolvedValueOnce(
      RESUMO_PIX_TRANSACOES_VAZIO,
    );

    const { result } = renderHook(() => usePixTransacoes());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.resumo.totalRecebido).toBe(25);
    expect(result.current.resumo.ticketMedio).toBe(25);
  });

  it("Deve usar mock local em DEV quando transações reais não existirem", async () => {
    vi.stubEnv("DEV", true);
    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValueOnce(
      [],
    );
    vi.mocked(pixTransacoesService.buscarResumo).mockResolvedValueOnce(
      resumoApi,
    );

    const { result } = renderHook(() => usePixTransacoes());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.transacoes).toEqual(pixTransacoesMock);
    expect(result.current.resumo.totalRecebido).toBe(50);
  });

  it("Deve filtrar transações usando CPF, documento do comprador e rifas", async () => {
    const transacoes = [
      criarTransacao({
        id: "tx_cpf",
        referenceId: "ref_cpf",
        aderido: { nome: "Ana Costa", cpf: "11122233344" },
        compradorDocumento: "00000000000",
        rifas: [{ numero: "010" }],
      }),
      criarTransacao({
        id: "tx_rifa",
        referenceId: "ref_rifa",
        aderido: { nome: "Bruno Lima", cpf: "55566677788" },
        compradorDocumento: "12345678900",
        rifas: [{ numero: "099" }],
      }),
    ];

    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValueOnce(
      transacoes,
    );
    vi.mocked(pixTransacoesService.buscarResumo).mockResolvedValueOnce(
      resumoApi,
    );

    const { result } = renderHook(() => usePixTransacoes());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    act(() => {
      result.current.setFiltros({ status: "todas", busca: "111.222.333-44" });
    });

    expect(result.current.transacoesFiltradas).toEqual([transacoes[0]]);

    act(() => {
      result.current.setFiltros({ status: "todas", busca: "12345678900" });
    });

    expect(result.current.transacoesFiltradas).toEqual([transacoes[1]]);

    act(() => {
      result.current.setFiltros({ status: "todas", busca: "099" });
    });

    expect(result.current.transacoesFiltradas).toEqual([transacoes[1]]);
  });

  it("Deve expor ação local para aceitar Pix confirmado pelo banco", async () => {
    const transacoes = [
      criarTransacao({ id: "tx_paga", statusPagamento: "PAID" }),
      criarTransacao({
        id: "tx_aguardando",
        statusPagamento: "WAITING",
        valorPago: 0,
      }),
    ];

    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValueOnce(
      transacoes,
    );
    vi.mocked(pixTransacoesService.buscarResumo).mockResolvedValueOnce(
      RESUMO_PIX_TRANSACOES_VAZIO,
    );

    const { result } = renderHook(() => usePixTransacoes());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      await result.current.aceitarPixTransacao("tx_paga");
    });

    await waitFor(() => {
      expect(result.current.transacoes[0].statusValidacao).toBe("aceita");
    });

    expect(result.current.resumo.quantidadeAceitas).toBe(1);
    expect(result.current.resumo.quantidadeAguardandoValidacao).toBe(0);
    expect(result.current.resumo.quantidadeSemConfirmacaoBancaria).toBe(1);
  });

  it("Deve bloquear validação local quando Pix ainda não foi confirmado pelo banco", async () => {
    const transacoes = [
      criarTransacao({
        id: "tx_aguardando",
        statusPagamento: "WAITING",
        valorPago: 0,
      }),
    ];

    vi.mocked(pixTransacoesService.buscarTransacoes).mockResolvedValueOnce(
      transacoes,
    );
    vi.mocked(pixTransacoesService.buscarResumo).mockResolvedValueOnce(
      RESUMO_PIX_TRANSACOES_VAZIO,
    );

    const { result } = renderHook(() => usePixTransacoes());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      await result.current.negarPixTransacao("tx_aguardando");
    });

    expect(result.current.transacoes[0].statusValidacao).toBeUndefined();
    expect(result.current.erroValidacaoPixPorId.tx_aguardando).toMatch(
      /confirmação bancária/i,
    );
  });
});
