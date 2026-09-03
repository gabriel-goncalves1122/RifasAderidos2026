// ============================================================================
// ARQUIVO: frontend/tests/shared/services/api.test.ts
// ============================================================================
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const usuarioMock = {
    getIdToken: vi.fn().mockResolvedValue("fake-token-123"),
  };

  return {
    usuarioMock,

    auth: {
      currentUser: usuarioMock as any,
      signOut: vi.fn().mockResolvedValue(undefined),
    },

    onAuthStateChanged: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock("@/shared/config/firebase", () => ({
  auth: mocks.auth,
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
  signOut: mocks.signOut,
}));

import { fetchAPI } from "@/shared/services/api";
import { auth } from "@/shared/config/firebase";

describe("Funcao Mestra: fetchAPI", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.usuarioMock.getIdToken.mockResolvedValue("fake-token-123");

    (auth as any).currentUser = mocks.usuarioMock;

    mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(mocks.usuarioMock);
      return vi.fn();
    });

    global.fetch = vi.fn();

    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  afterEach(() => {
    (window as any).location = originalLocation;
  });

  it("Deve fazer uma requisicao GET com autenticacao por padrao", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ sucesso: true }),
    });

    const resposta = await fetchAPI("/teste");

    expect(mocks.usuarioMock.getIdToken).toHaveBeenCalledTimes(1);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/teste"),
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: "Bearer fake-token-123",
        },
      },
    );

    expect(resposta).toEqual({ sucesso: true });
  });

  it("Deve fazer uma requisicao POST com JSON e sem autenticacao", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ salvo: true }),
    });

    const body = { nome: "Teste" };

    const resposta = await fetchAPI("/publico", "POST", body, false);

    expect(mocks.usuarioMock.getIdToken).not.toHaveBeenCalled();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/publico"),
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    expect(resposta).toEqual({ salvo: true });
  });

  it("Deve bloquear rota autenticada quando nao houver usuario logado", async () => {
    (auth as any).currentUser = null;

    mocks.onAuthStateChanged.mockImplementationOnce((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    await expect(fetchAPI("/secreto")).rejects.toThrow(
      "Usuario nao autenticado no sistema.",
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("Deve capturar e repassar erros normais, sem deslogar o usuario", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({ error: "Erro de validacao nos campos." }),
    });

    await expect(
      fetchAPI("/validacao", "POST", undefined, false),
    ).rejects.toThrow("Erro de validacao nos campos.");

    expect(auth.signOut).not.toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it("Deve forcar logout e redirecionar em caso de 401 ou 403", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () =>
        JSON.stringify({ error: "Acesso Negado pela Tesouraria" }),
    });

    await expect(fetchAPI("/admin", "GET", undefined, false)).rejects.toThrow(
      "A sua sessao expirou. Por favor, faca login novamente.",
    );

    expect(auth.signOut).toHaveBeenCalledTimes(1);

    expect(window.location.href).toBe("/login");
  });

  it("Deve retornar fallback seguro quando resposta nao for JSON valido", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => "NAO-E-JSON",
    });

    const resposta = await fetchAPI("/rota", "GET", undefined, false);

    // Em DEV (Vitest) o warn e esperado. Em PROD nao seria chamado.
    // O importante e que a resposta sempre tenha fallback seguro.
    expect(resposta.error).toContain("Resposta inesperada do servidor");

    consoleWarnSpy.mockRestore();
  });

  it("Deve retornar Blob quando responseType for blob", async () => {
    const blob = new Blob(["zip"], { type: "application/zip" });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: async () => blob,
    });

    const resposta = await fetchAPI(
      "/admin/compactar",
      "POST",
      { nomePacote: "Backup", ficheiros: ["backup_geral"] },
      true,
      "blob",
    );

    expect(resposta).toBe(blob);
  });
});
