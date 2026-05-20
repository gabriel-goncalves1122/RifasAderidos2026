// ============================================================================
// ARQUIVO: frontend/tests/rifas/useRifas.test.tsx
// ============================================================================
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useRifas } from "@/controllers/useRifas";
import { fetchAPI } from "@/controllers/api";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Mocka a ponte HTTP usada pelo hook para falar com o backend.
vi.mock("@/controllers/api", () => ({
  fetchAPI: vi.fn(),
}));

// Mocka o mesmo caminho usado após a migração para shared/config.
vi.mock("@/shared/config/firebase", () => ({
  auth: {
    currentUser: {
      uid: "user-123",
    },
  },
  storage: {},
}));

// O hook usa Storage para reenviar comprovantes recusados.
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({})),
  connectStorageEmulator: vi.fn(),
  ref: vi.fn(() => "mock-storage-ref"),
  uploadBytes: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));

describe("Hook: useRifas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mantém o terminal limpo nos testes que simulam falha.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("Deve buscar minhas rifas com sucesso", async () => {
    vi.mocked(fetchAPI).mockResolvedValueOnce({
      bilhetes: [{ numero: "001" }],
    });

    const { result } = renderHook(() => useRifas());

    let rifas;

    await act(async () => {
      rifas = await result.current.buscarMinhasRifas();
    });

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/minhas-rifas");
    expect(rifas).toEqual([{ numero: "001" }]);
  });

  it("Deve corrigir rifas recusadas, enviando novo comprovante e chamando a API", async () => {
    const mockFile = new File(["dummy_content"], "comprovante_novo.pdf", {
      type: "application/pdf",
    });

    // Simula o fluxo completo: cria ref, faz upload e recupera URL pública.
    vi.mocked(uploadBytesResumable).mockResolvedValueOnce({
      ref: "fake-ref",
    } as any);

    vi.mocked(getDownloadURL).mockResolvedValueOnce(
      "https://fake-url.com/novo-pdf.pdf",
    );

    vi.mocked(fetchAPI).mockResolvedValueOnce({
      sucesso: true,
    });

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
    expect(ref).toHaveBeenCalled();
    expect(uploadBytesResumable).toHaveBeenCalled();
    expect(getDownloadURL).toHaveBeenCalledWith("fake-ref");

    expect(fetchAPI).toHaveBeenCalledWith("/rifas/corrigir", "POST", {
      numerosRifas: ["015", "016"],
      nome: "Gabriel Sampaio",
      telefone: "(11) 99999-9999",
      email: "gabriel@unifei.edu.br",
      comprovanteUrl: "https://fake-url.com/novo-pdf.pdf",
    });
  });

  it("Deve retornar false e alertar quando a correção falhar no upload", async () => {
    const mockFile = new File(["dummy_content"], "comprovante.png", {
      type: "image/png",
    });

    const mockAlert = vi.fn();

    vi.stubGlobal("alert", mockAlert);

    // Garante que falha de Storage não chama o backend.
    vi.mocked(uploadBytesResumable).mockRejectedValueOnce(
      new Error("Erro no Storage"),
    );

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
  });
});
