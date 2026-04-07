// ============================================================================
// ARQUIVO: frontend/tests/api.test.ts
// ============================================================================
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAPI } from "../src/controllers/api";
import { auth } from "../src/config/firebase";

// Mock do Firebase Auth
vi.mock("../src/config/firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue("fake-token-123"),
    },
  },
}));

describe("Função Mestra: fetchAPI", () => {
  beforeEach(() => {
    // Intercepta o "fetch" nativo do navegador para não bater na internet de verdade
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve fazer uma requisição GET com autenticação por defeito", async () => {
    // Simula o backend respondendo "OK"
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sucesso: true }),
    });

    const resposta = await fetchAPI("/teste");

    // Verifica se montou o cabeçalho Authorization corretamente
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
    // Passamos `false` no último parâmetro para rotas públicas
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
    // Escondemos o usuário temporariamente
    const backupUser = auth.currentUser;
    (auth as any).currentUser = null;

    // Tenta fazer a requisição, o nosso api.ts deve barrar imediatamente
    await expect(fetchAPI("/secreto")).rejects.toThrow(
      "Usuário não autenticado no sistema.",
    );

    // Confirma que não chegou sequer a ir à internet
    expect(global.fetch).not.toHaveBeenCalled();

    // Restaura o usuário para os próximos testes
    (auth as any).currentUser = backupUser;
  });

  it("Deve capturar e repassar o erro enviado pelo Backend (ex: 403 Forbidden)", async () => {
    // Simula o backend atirando um erro (ex: Tentativa de fraude)
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: "Acesso Negado pela Tesouraria" }),
    });

    await expect(fetchAPI("/admin")).rejects.toThrow(
      "Acesso Negado pela Tesouraria",
    );
  });
});
