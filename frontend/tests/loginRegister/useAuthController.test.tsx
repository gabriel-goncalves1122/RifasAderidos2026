import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthController } from "../../src/controllers/useAuthController";
import { fetchAPI } from "../../src/controllers/api";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// 1. Mocks dos caminhos internos (CORRIGIDO PARA DOIS PONTOS: ../../)
vi.mock("../../src/config/firebase", () => ({ auth: {}, db: {} }));
vi.mock("../../src/controllers/api", () => ({ fetchAPI: vi.fn() }));

// 2. Mocks dos módulos do Firebase
vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/auth")>();
  return {
    ...actual,
    getAuth: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi
      .fn()
      .mockResolvedValue({ user: { uid: "123" } }),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(() => vi.fn()),
    connectAuthEmulator: vi.fn(),
  };
});

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true }),
  doc: vi.fn(),
  getDoc: vi.fn(),
  connectFirestoreEmulator: vi.fn(),
}));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(),
  connectStorageEmulator: vi.fn(), // <-- CORRIGIDO PARA STORAGE!
}));

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

    expect(fetchAPI).toHaveBeenNthCalledWith(
      1,
      "/auth/elegibilidade",
      "POST",
      { email: "teste@unifei.br" },
      false,
    );
    expect(fetchAPI).toHaveBeenNthCalledWith(
      2,
      "/auth/completar-registo",
      "POST",
      { nome: "Gabriel", cpf: "111.222.333-44" },
      true,
    );
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
