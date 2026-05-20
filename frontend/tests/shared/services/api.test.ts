// ============================================================================
// ARQUIVO: frontend/tests/auditoria/api.test.tsx
// ============================================================================
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mocka o mesmo caminho usado pelo fetchAPI após a migração para shared/config.
vi.mock("@/shared/config/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue("fake-token-123"),
    },
    signOut: vi.fn().mockResolvedValue(undefined),
  },
}));

import { fetchAPI } from "@/controllers/api";
import { auth } from "@/shared/config/firebase";

describe("Função Mestra: fetchAPI", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();

    // Permite testar redirecionamento sem depender do objeto real do jsdom.
    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (window as any).location = originalLocation;
  });

  it("Deve fazer uma requisição GET com autenticação por padrão", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ sucesso: true }),
    });

    const resposta = await fetchAPI("/teste");

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
    const backupUser = auth.currentUser;

    // Simula ausência de sessão no Firebase Auth.
    (auth as any).currentUser = null;

    await expect(fetchAPI("/secreto")).rejects.toThrow(
      "Usuário não autenticado no sistema.",
    );

    expect(global.fetch).not.toHaveBeenCalled();

    (auth as any).currentUser = backupUser;
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

    expect(auth.signOut).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe("/login");
  });
});
