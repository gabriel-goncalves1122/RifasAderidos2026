import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTesouraria } from "../src/controllers/useTesouraria";
import { fetchAPI } from "../src/controllers/api";

// Falsificamos o nosso motor de API
vi.mock("../src/controllers/api", () => ({
  fetchAPI: vi.fn(),
}));

describe("Hook: useTesouraria", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve buscar o relatório com sucesso e gerenciar o estado de loading", async () => {
    // Prepara a resposta falsa da API
    const mockResposta = { totalArrecadado: 1000 };
    (fetchAPI as any).mockResolvedValueOnce(mockResposta);

    const { result } = renderHook(() => useTesouraria());

    // Inicialmente não deve ter erro e loading é false
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    let relatorio;
    // act() é obrigatório quando testamos hooks que mudam estado
    await act(async () => {
      relatorio = await result.current.buscarRelatorio();
    });

    expect(fetchAPI).toHaveBeenCalledWith("/relatorio");
    expect(relatorio).toEqual(mockResposta);
    expect(result.current.loading).toBe(false); // O loading volta a false no finally
    expect(result.current.error).toBeNull();
  });

  it("Deve capturar o erro se a requisição do relatório falhar (ex: Token Inválido)", async () => {
    (fetchAPI as any).mockRejectedValueOnce(new Error("Token expirado"));

    const { result } = renderHook(() => useTesouraria());

    let relatorio;
    await act(async () => {
      relatorio = await result.current.buscarRelatorio();
    });

    expect(relatorio).toBeNull();
    expect(result.current.error).toBe("Token expirado");
    expect(result.current.loading).toBe(false);
  });

  it("Deve retornar um array vazio se o histórico falhar", async () => {
    (fetchAPI as any).mockRejectedValueOnce(new Error("Erro interno"));

    const { result } = renderHook(() => useTesouraria());

    let historico;
    await act(async () => {
      historico = await result.current.buscarHistoricoDetalhado();
    });

    expect(historico).toEqual([]); // Tratamento de erro silencioso do hook
  });
});
