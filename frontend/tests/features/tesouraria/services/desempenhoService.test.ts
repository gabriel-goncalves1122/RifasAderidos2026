import { beforeEach, describe, expect, it, vi } from "vitest";

import { desempenhoService } from "@/features/tesouraria/services/desempenhoService";
import { fetchAPI } from "@/shared/services/api";

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Service: desempenhoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve buscar relatório de desempenho no endpoint legado atual", async () => {
    const relatorio = {
      resumoGeral: { totalArrecadado: 500, rifasPagas: 50, aderidosAtivos: 10 },
      aderidos: [{ arrecadado: 150, meta: 100 }],
    };
    vi.mocked(fetchAPI).mockResolvedValueOnce(relatorio);

    const resultado = await desempenhoService.buscarRelatorio();

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/relatorio");
    expect(resultado).toEqual(relatorio);
  });

  it("Deve normalizar relatório vazio sem quebrar a tela", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({});

    const resultado = await desempenhoService.buscarRelatorio();

    expect(resultado).toEqual({
      resumoGeral: { totalArrecadado: 0, rifasPagas: 0, aderidosAtivos: 0 },
      aderidos: [],
    });
  });

  it("Deve buscar histórico detalhado no endpoint legado atual", async () => {
    const historico = [
      { status: "pago", data_reserva: "2026-05-01", valor: 100 },
    ];
    vi.mocked(fetchAPI).mockResolvedValueOnce({ historico });

    const resultado = await desempenhoService.buscarHistoricoDetalhado();

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/historico");
    expect(resultado).toEqual(historico);
  });

  it("Deve retornar histórico vazio quando o payload vier sem lista", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({});

    const resultado = await desempenhoService.buscarHistoricoDetalhado();

    expect(resultado).toEqual([]);
  });
});
