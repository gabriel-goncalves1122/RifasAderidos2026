import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthController } from "../src/controllers/useAuthController";
import { fetchAPI } from "../src/controllers/api";

// 1. Mocks do Firebase Auth e Firestore
vi.mock("../src/config/firebase", () => ({ auth: {}, db: {} }));
vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi
    .fn()
    .mockResolvedValue({ user: { uid: "123" } }),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()), // Mock do listener do React
}));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true }),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));
vi.mock("../src/controllers/api", () => ({ fetchAPI: vi.fn() }));

import { signInWithEmailAndPassword, signOut } from "firebase/auth";

describe("Hook: useAuthController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("Deve realizar login com sucesso e controlar o loading/error", async () => {
    (signInWithEmailAndPassword as any).mockResolvedValueOnce(true);
    const { result } = renderHook(() => useAuthController());

    let sucesso;
    await act(async () => {
      sucesso = await result.current.handleLogin("teste@unifei.br", "senha123");
    });

    expect(sucesso).toBe(true);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "teste@unifei.br",
      "senha123",
    );
    expect(result.current.error).toBeNull();
  });

  it("Deve atirar erro de login quando as credenciais falharem", async () => {
    (signInWithEmailAndPassword as any).mockRejectedValueOnce(
      new Error("ErroAuth"),
    );
    const { result } = renderHook(() => useAuthController());

    let sucesso;
    await act(async () => {
      sucesso = await result.current.handleLogin("errado@email.com", "errado");
    });

    expect(sucesso).toBe(false);
    expect(result.current.error).toBe("E-mail ou senha incorretos.");
  });

  it("Deve seguir as 3 etapas de Registo (Backend -> Auth -> Backend)", async () => {
    // Simulando que o Backend aprovou o E-mail e o completamento do registo
    (fetchAPI as any).mockResolvedValue({ sucesso: true });

    const { result } = renderHook(() => useAuthController());

    let user: any;
    await act(async () => {
      user = await result.current.handleRegister(
        "Gabriel",
        "teste@unifei.br",
        "senha123",
        "111.222.333-44",
      );
    });

    // 1. Verificou elegibilidade (Público)
    expect(fetchAPI).toHaveBeenNthCalledWith(
      1,
      "/auth/elegibilidade",
      "POST",
      { email: "teste@unifei.br" },
      false,
    );

    // 2. Avisou o Backend para salvar no Firestore (Autenticado)
    expect(fetchAPI).toHaveBeenNthCalledWith(
      2,
      "/auth/completar-registo",
      "POST",
      { nome: "Gabriel", cpf: "111.222.333-44" },
      true,
    );

    // O mock devolve o uid 123
    expect(user?.uid).toBe("123");
  });

  it("Deve chamar a função de logout do Firebase", async () => {
    const { result } = renderHook(() => useAuthController());
    await act(async () => {
      await result.current.handleLogout();
    });
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
