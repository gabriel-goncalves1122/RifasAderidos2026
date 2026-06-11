import { beforeEach, describe, expect, it, vi } from "vitest";

import { aderidoRifaService } from "@/features/aderidos/services/aderidoRifaService";
import { fetchAPI } from "@/shared/services/api";

vi.mock("@/shared/services/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Service: aderidoRifaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve buscar minhas rifas e retornar os bilhetes", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      bilhetes: [{ numero: "001" }],
    });

    const resultado = await aderidoRifaService.buscarMinhasRifas();

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/minhas-rifas");
    expect(resultado).toEqual([{ numero: "001" }]);
  });

  it("Deve retornar array vazio se nao houver bilhetes", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({});

    const resultado = await aderidoRifaService.buscarMinhasRifas();

    expect(resultado).toEqual([]);
  });

  it("Deve corrigir apenas dados das rifas recusadas", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({ sucesso: true });

    const resultado = await aderidoRifaService.corrigirDadosRifasRecusadas({
      numerosRifas: ["015"],
      nome: "Ana",
      telefone: "(11) 99999-9999",
      email: "ana@teste.com",
    });

    expect(resultado).toBe(true);
    expect(fetchAPI).toHaveBeenCalledWith("/rifas/corrigir-dados", "POST", {
      nome: "Ana",
      telefone: "(11) 99999-9999",
      email: "ana@teste.com",
      numerosRifas: ["015"],
    });
  });
});
