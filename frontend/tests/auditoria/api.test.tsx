// ============================================================================
// ARQUIVO: frontend/tests/api.test.ts (ou auditoria/api.test.tsx)
// ============================================================================
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAPI } from "../../src/controllers/api";
import { auth } from "../../src/config/firebase";

// Mock do Firebase Auth ATUALIZADO para incluir o signOut
vi.mock("../../src/config/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue("fake-token-123"),
    },
    signOut: vi.fn().mockResolvedValue(true), // <- CORREÇÃO: Adicionamos o mock do signOut
  },
}));

describe("Função Mestra: fetchAPI", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Intercepta o "fetch" nativo do navegador
    global.fetch = vi.fn();
    vi.clearAllMocks();

    // Mock do window.location para testar o redirecionamento sem recarregar a página de testes
    delete (window as any).location;
    window.location = { href: "" } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.location = originalLocation;
  });

  it("Deve fazer uma requisição GET com autenticação por defeito", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sucesso: true }),
    });

    const resposta = await fetchAPI("/teste");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/teste"),
      {
        method: "GET",
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
      json: async () => ({ salvo: true }),
    });

    const body = { nome: "Teste" };
    const resposta = await fetchAPI("/publico", "POST", body, false);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/publico"),
      {
        method: "POST",
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
    // Simulamos um erro 400 normal (dados inválidos), que NÃO desloga o usuário
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Erro de validação nos campos." }),
    });

    await expect(
      fetchAPI("/validacao", "POST", undefined, false),
    ).rejects.toThrow("Erro de validação nos campos.");

    // Confirma que não tentou deslogar ninguém num erro 400
    expect(auth.signOut).not.toHaveBeenCalled();
  });

  it("MECANISMO DE SEGURANÇA: Deve forçar Logout e Redirecionar em caso de erro 401 ou 403", async () => {
    // Simulamos o backend atirando 403 (Sessão Expirada ou Acesso Negado)
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: "Acesso Negado pela Tesouraria" }),
    });

    // Como o fetchAPI vai atirar erro de sessão expirada, testamos a nova mensagem
    await expect(fetchAPI("/admin", "GET", undefined, false)).rejects.toThrow(
      "A sua sessão expirou. Por favor, faça login novamente.",
    );

    // Verifica se a função de logout foi chamada
    expect(auth.signOut).toHaveBeenCalled();

    // Verifica se forçou o navegador a ir para a página de Login
    expect(window.location.href).toBe("/login");
  });
});
