import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuditoriaComprasController } from "@/features/tesouraria/hooks/useAuditoriaComprasController";
import { auditoriaComprasService } from "@/features/tesouraria/services/auditoriaComprasService";

vi.mock("@/features/tesouraria/services/auditoriaComprasService", () => ({
  auditoriaComprasService: {
    buscarHistoricoDetalhado: vi.fn(),
  },
}));

const historicoMock = [
  {
    numero_rifa: "001",
    status: "pago",
    vendedor_id: "aderido_ana",
    vendedor_nome: "Ana Vendedora",
    vendedor_cpf: "11122233344",
    comprador_id: "comprador_maria",
    comprador_nome: "Maria Souza",
    comprador_email: "maria@teste.com",
    comprador_telefone: "35999990000",
    data_reserva: "2026-05-01T10:00:00.000-03:00",
    data_pagamento: "2026-05-02T10:00:00.000-03:00",
    comprovante_url: "https://storage.mock/comprovante-maria.png",
    valor: 10,
  },
  {
    numero_rifa: "002",
    status: "pago",
    vendedor_id: "aderido_ana",
    vendedor_nome: "Ana Vendedora",
    vendedor_cpf: "11122233344",
    comprador_id: "comprador_maria",
    comprador_nome: "Maria Souza",
    comprador_email: "maria@teste.com",
    comprador_telefone: "35999990000",
    data_reserva: "2026-05-01T10:00:00.000-03:00",
    data_pagamento: "2026-05-02T10:00:00.000-03:00",
    comprovante_url: "https://storage.mock/comprovante-maria.png",
    valor: 10,
  },
  {
    numero_rifa: "003",
    status: "pendente",
    vendedor_id: "aderido_bruno",
    vendedor_nome: "Bruno Vendedor",
    vendedor_cpf: "55566677788",
    comprador_id: "comprador_joao",
    comprador_nome: "João Lima",
    comprador_email: "joao@teste.com",
    comprador_telefone: "35988887777",
    data_reserva: "2026-05-10T10:00:00.000-03:00",
    data_pagamento: "-",
    comprovante_url: null,
    valor: 10,
  },
];

describe("Hook-controller: useAuditoriaComprasController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(
      auditoriaComprasService.buscarHistoricoDetalhado,
    ).mockResolvedValue(historicoMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve carregar histórico e montar compras agrupadas e resumo", async () => {
    const { result } = renderHook(() => useAuditoriaComprasController());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(auditoriaComprasService.buscarHistoricoDetalhado).toHaveBeenCalledTimes(
      1,
    );
    expect(result.current.comprasFiltradas).toHaveLength(2);
    expect(result.current.resumo.totalCompras).toBe(2);
    expect(result.current.resumo.totalRifas).toBe(3);
    expect(result.current.resumo.valorTotal).toBe(30);
  });

  it("Deve aplicar filtros e limpar o estado de filtros", async () => {
    const { result } = renderHook(() => useAuditoriaComprasController());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    act(() => {
      result.current.setFiltros({
        ...result.current.filtros,
        termoBusca: "003",
      });
    });

    expect(result.current.filtrosAtivos).toBe(true);
    expect(result.current.comprasFiltradas).toHaveLength(1);
    expect(result.current.comprasFiltradas[0].comprador_nome).toBe("João Lima");

    act(() => {
      result.current.limparFiltros();
    });

    expect(result.current.filtrosAtivos).toBe(false);
    expect(result.current.comprasFiltradas).toHaveLength(2);
  });

  it("Deve controlar detalhes, edição e comprovante selecionado", async () => {
    const { result } = renderHook(() => useAuditoriaComprasController());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    const compraComComprovante = result.current.comprasFiltradas.find(
      (compra) => Boolean(compra.comprovante_url),
    );

    expect(compraComComprovante).toBeDefined();

    act(() => {
      result.current.abrirDetalhes(compraComComprovante!);
      result.current.abrirEdicao(compraComComprovante!);
      result.current.abrirComprovante(compraComComprovante!);
    });

    expect(result.current.compraSelecionada).toBe(compraComComprovante);
    expect(result.current.compraEdicao).toBe(compraComComprovante);
    expect(result.current.comprovanteUrl).toBe(
      "https://storage.mock/comprovante-maria.png",
    );

    act(() => {
      result.current.fecharDetalhes();
      result.current.fecharEdicao();
      result.current.fecharComprovante();
    });

    expect(result.current.compraSelecionada).toBeNull();
    expect(result.current.compraEdicao).toBeNull();
    expect(result.current.comprovanteUrl).toBeNull();
  });

  it("Deve exportar CSV quando houver resultado filtrado", async () => {
    const createObjectURL = vi.fn().mockReturnValue("blob:auditoria");
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    const { result } = renderHook(() => useAuditoriaComprasController());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    act(() => {
      result.current.baixarCSV();
    });

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("Deve usar estado vazio quando o service falhar", async () => {
    vi.mocked(
      auditoriaComprasService.buscarHistoricoDetalhado,
    ).mockRejectedValueOnce(new Error("Histórico indisponível"));

    const { result } = renderHook(() => useAuditoriaComprasController());

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.comprasFiltradas).toEqual([]);
    expect(result.current.resumo.totalCompras).toBe(0);
  });
});
