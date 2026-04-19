// ============================================================================
// ARQUIVO: frontend/tests/rifas/useRifas.test.tsx
// ============================================================================
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRifas } from "../../src/controllers/useRifas";
import { fetchAPI } from "../../src/controllers/api";

// 1. CORREÇÃO DE TYPESCRIPT: Removido o 'uploadBytes' do import, pois não é usado neste ficheiro
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Mocks
vi.mock("../../src/controllers/api", () => ({
  fetchAPI: vi.fn(),
}));

vi.mock("../../src/config/firebase", () => ({
  auth: { currentUser: { uid: "user-123" } },
  storage: {},
}));

vi.mock("firebase/storage", () => ({
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
  uploadBytes: vi.fn(), // Mantemos no mock interno para não quebrar outras funções
}));

describe("Hook: useRifas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // BÓNUS: Silencia logs de erro no console durante os testes para o terminal ficar limpo
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("Deve buscar minhas rifas com sucesso", async () => {
    (fetchAPI as any).mockResolvedValueOnce({ bilhetes: [{ numero: "001" }] });
    const { result } = renderHook(() => useRifas());

    let rifas;
    await act(async () => {
      rifas = await result.current.buscarMinhasRifas();
    });

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/minhas-rifas");
    expect(rifas).toEqual([{ numero: "001" }]);
  });

  it("NOVO: Deve corrigir rifas recusadas, fazendo upload do novo comprovativo e chamando a API", async () => {
    const mockFile = new File(["dummy_content"], "comprovante_novo.pdf", {
      type: "application/pdf",
    });

    // Simula o upload sendo bem sucedido e retornando uma URL
    (uploadBytesResumable as any).mockResolvedValueOnce({ ref: "fake-ref" });
    (getDownloadURL as any).mockResolvedValueOnce(
      "https://fake-url.com/novo-pdf.pdf",
    );
    (fetchAPI as any).mockResolvedValueOnce({ sucesso: true });

    const { result } = renderHook(() => useRifas());

    let sucesso = false;
    await act(async () => {
      sucesso = await result.current.corrigirRifasRecusadas(
        ["015", "016"],
        mockFile,
        {
          nome: "Gabriel Sampaio",
          email: "gabriel@unifei.edu.br",
          telefone: "(11) 99999-9999",
        },
      );
    });

    expect(sucesso).toBe(true);
    expect(uploadBytesResumable).toHaveBeenCalled();

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/corrigir", "POST", {
      numerosRifas: ["015", "016"],
      nome: "Gabriel Sampaio",
      telefone: "(11) 99999-9999",
      email: "gabriel@unifei.edu.br",
      comprovanteUrl: "https://fake-url.com/novo-pdf.pdf",
    });
  });

  it("Deve retornar false e capturar o erro se a correção falhar (ex: falha no upload)", async () => {
    const mockFile = new File(["dummy_content"], "comprovante.png", {
      type: "image/png",
    });

    // Força o upload a falhar
    (uploadBytesResumable as any).mockRejectedValueOnce(
      new Error("Erro no Storage"),
    );

    // 2. CORREÇÃO DO VITEST: Cria uma função "alert" global falsa para o ambiente de testes
    const mockAlert = vi.fn();
    vi.stubGlobal("alert", mockAlert);

    const { result } = renderHook(() => useRifas());

    let sucesso = true;
    await act(async () => {
      sucesso = await result.current.corrigirRifasRecusadas(["015"], mockFile, {
        nome: "Teste",
        email: "",
        telefone: "",
      });
    });

    expect(sucesso).toBe(false);
    expect(fetchAPI).not.toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith(
      "Erro ao reenviar correção. Tente novamente.",
    );

    // Limpa o alert falso depois deste teste para não afetar os outros
    vi.unstubAllGlobals();
  });
});
