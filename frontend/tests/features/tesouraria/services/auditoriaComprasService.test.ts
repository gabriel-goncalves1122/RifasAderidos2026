import { beforeEach, describe, expect, it, vi } from "vitest";

import { auditoriaComprasService } from "@/features/tesouraria/services/auditoriaComprasService";
import { fetchAPI } from "@/shared/services/api";

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Service: auditoriaComprasService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve buscar histórico no endpoint legado atual", async () => {
    const historico = [{ numero_rifa: "001", status: "pago" }];
    vi.mocked(fetchAPI).mockResolvedValueOnce({ historico });

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/historico");
    expect(resultado).toEqual(historico);
  });

  it("Deve aceitar lista direta no payload", async () => {
    const historico = [{ numero_rifa: "002", status: "pendente" }];
    vi.mocked(fetchAPI).mockResolvedValueOnce(historico);

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(resultado).toEqual(historico);
  });

  it("Deve aceitar objeto indexado no payload", async () => {
    const item = { numero_rifa: "003", status: "recusado" };
    vi.mocked(fetchAPI).mockResolvedValueOnce({ item });

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(resultado).toEqual([item]);
  });

  it("Deve retornar lista vazia quando o payload vier ausente", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce(null);

    const resultado = await auditoriaComprasService.buscarHistoricoDetalhado();

    expect(resultado).toEqual([]);
  });
});
