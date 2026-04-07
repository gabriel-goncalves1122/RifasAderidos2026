import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePremios } from "../src/controllers/usePremios";
import { fetchAPI } from "../src/controllers/api";

// Mock da API
vi.mock("../src/controllers/api", () => ({ fetchAPI: vi.fn() }));

// Mock do Firebase Storage
vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  connectStorageEmulator: vi.fn(),
  ref: vi.fn(),
  uploadBytes: vi.fn().mockResolvedValue(true),
  getDownloadURL: vi.fn().mockResolvedValue("http://storage.com/imagem.png"),
}));

// Resolve problema do alert em ambiente de teste
global.alert = vi.fn();

describe("Hook: usePremios", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Deve buscar prêmios com sucesso na rota pública", async () => {
    (fetchAPI as any).mockResolvedValueOnce({ premios: [] });
    const { result } = renderHook(() => usePremios());

    let premios;
    await act(async () => {
      premios = await result.current.buscarPremios();
    });

    expect(fetchAPI).toHaveBeenCalledWith("/premios", "GET", undefined, false);
    expect(premios).toEqual({ premios: [] });
  });

  it("Deve salvar um prêmio corretamente via POST", async () => {
    const { result } = renderHook(() => usePremios());
    const dadosPremio = { titulo: "Carro", colocacao: 1 };

    await act(async () => {
      await result.current.salvarPremio(dadosPremio);
    });

    expect(fetchAPI).toHaveBeenCalledWith("/premios", "POST", dadosPremio);
  });

  it("Deve fazer upload da imagem do prêmio para o Storage e devolver a URL", async () => {
    const { result } = renderHook(() => usePremios());
    const arquivoFalso = new File(["dummy"], "premio.png", {
      type: "image/png",
    });

    let url;
    await act(async () => {
      url = await result.current.uploadImagemPremio(arquivoFalso);
    });

    expect(url).toBe("http://storage.com/imagem.png");
  });
});
