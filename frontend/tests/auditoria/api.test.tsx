// ============================================================================
// ARQUIVO: frontend/tests/auditoria/api.test.tsx
// ============================================================================
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAPI } from "../../src/controllers/api";
import { auth } from "../../src/config/firebase";

vi.mock("../../src/config/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue("fake-token-123"),
    },
    signOut: vi.fn().mockResolvedValue(true),
  },
}));

describe("Função Mestra: fetchAPI", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (window as any).location = originalLocation;
  });

  it("Deve fazer uma requisição GET com autenticação por defeito", async () => {
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

  it("Deve fazer uma requisição POST com JSON e SEM autenticação", async () => {
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

  it("Deve atirar um erro de segurança se a rota exigir auth mas o usuário estiver deslogado", async () => {
    const backupUser = auth.currentUser;
    (auth as any).currentUser = null;

    await expect(fetchAPI("/secreto")).rejects.toThrow(
      "Usuário não autenticado no sistema.",
    );

    expect(global.fetch).not.toHaveBeenCalled();
    (auth as any).currentUser = backupUser;
  });

  it("Deve capturar e repassar erros normais (ex: 400 Bad Request)", async () => {
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

  it("MECANISMO DE SEGURANÇA: Deve forçar Logout e Redirecionar em caso de erro 401 ou 403", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () =>
        JSON.stringify({ error: "Acesso Negado pela Tesouraria" }),
    });

    await expect(fetchAPI("/admin", "GET", undefined, false)).rejects.toThrow(
      "A sua sessão expirou. Por favor, faça login novamente.",
    );

    expect(auth.signOut).toHaveBeenCalled();
    expect(window.location.href).toBe("/login");
  });
});
