import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuditoria } from "../src/controllers/useAuditoria";
import { fetchAPI } from "../src/controllers/api";

vi.mock("../src/controllers/api", () => ({ fetchAPI: vi.fn() }));
global.alert = vi.fn();

describe("Hook: useAuditoria", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Deve buscar bilhetes pendentes e controlar o loading", async () => {
    (fetchAPI as any).mockResolvedValueOnce({ bilhetes: [{ numero: "001" }] });
    const { result } = renderHook(() => useAuditoria());

    let pendentes;
    await act(async () => {
      pendentes = await result.current.buscarPendentes();
    });

    expect(fetchAPI).toHaveBeenCalledWith("/pendentes");
    expect(pendentes).toHaveLength(1);
    expect(result.current.loading).toBe(false);
  });

  it("Deve enviar a avaliação manual corretamente", async () => {
    (fetchAPI as any).mockResolvedValueOnce({ sucesso: true });
    const { result } = renderHook(() => useAuditoria());

    let sucesso;
    await act(async () => {
      sucesso = await result.current.avaliarComprovante(
        ["001"],
        "rejeitar",
        "Pix Inválido",
      );
    });

    expect(sucesso).toBe(true);
    expect(fetchAPI).toHaveBeenCalledWith("/avaliar", "POST", {
      numerosRifas: ["001"],
      decisao: "rejeitar",
      motivo: "Pix Inválido",
    });
  });

  it("Deve disparar a rotina de IA em Lote (Python Backend)", async () => {
    (fetchAPI as any).mockResolvedValueOnce({ mensagem: "IA executada" });
    const { result } = renderHook(() => useAuditoria());

    let resposta;
    await act(async () => {
      resposta = await result.current.auditarEmLoteComIA();
    });

    expect(fetchAPI).toHaveBeenCalledWith("/auditar-lote", "POST");
    expect(resposta).toEqual({ mensagem: "IA executada" });
  });
});
