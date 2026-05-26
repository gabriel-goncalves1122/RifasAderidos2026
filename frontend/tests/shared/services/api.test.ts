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

// Configuração Firebase usada diretamente pelo fetchAPI.
vi.mock("@/shared/config/firebase", () => ({
  auth: mocks.auth,
}));

// O fetchAPI novo aguarda o Firebase resolver a sessão por onAuthStateChanged.
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
  signOut: mocks.signOut,
}));

import { fetchAPI } from "@/shared/services/api";
import { auth } from "@/shared/config/firebase";

describe("Função Mestra: fetchAPI", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.usuarioMock.getIdToken.mockResolvedValue("fake-token-123");

    // Estado padrão dos testes: usuário autenticado.
    (auth as any).currentUser = mocks.usuarioMock;

    mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(mocks.usuarioMock);
      return vi.fn();
    });

    global.fetch = vi.fn();

    // Permite testar redirecionamento sem depender do objeto real do jsdom.
    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  afterEach(() => {
    (window as any).location = originalLocation;
  });

  it("Deve fazer uma requisição GET com autenticação por padrão", async () => {
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

  it("Deve fazer uma requisição POST com JSON e sem autenticação", async () => {
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

  it("Deve bloquear rota autenticada quando não houver usuário logado", async () => {
    // Simula ausência de sessão tanto no estado direto quanto no listener.
    (auth as any).currentUser = null;

    mocks.onAuthStateChanged.mockImplementationOnce((_auth, callback) => {
      callback(null);
      return vi.fn();
    });

    await expect(fetchAPI("/secreto")).rejects.toThrow(
      "Usuário não autenticado no sistema.",
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("Deve capturar e repassar erros normais, sem deslogar o usuário", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({ error: "Erro de validação nos campos." }),
    });

    await expect(
      fetchAPI("/validacao", "POST", undefined, false),
    ).rejects.toThrow("Erro de validação nos campos.");

    expect(auth.signOut).not.toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it("Deve forçar logout e redirecionar em caso de 401 ou 403", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () =>
        JSON.stringify({ error: "Acesso Negado pela Tesouraria" }),
    });

    await expect(fetchAPI("/admin", "GET", undefined, false)).rejects.toThrow(
      "A sua sessão expirou. Por favor, faça login novamente.",
    );

    // Mantém compatibilidade caso o service use auth.signOut().
    expect(auth.signOut).toHaveBeenCalledTimes(1);

    expect(window.location.href).toBe("/login");
  });
});
