// ============================================================================
// ARQUIVO: frontend/tests/features/auth/services/authService.test.ts
// ============================================================================
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue("TOKEN_TESTE"),
    },
  },

  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
  fetchAPI: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  sendPasswordResetEmail: mocks.sendPasswordResetEmail,
  signOut: mocks.signOut,
}));

vi.mock("@/shared/config/firebase", () => ({
  auth: mocks.auth,
}));

vi.mock("@/shared/services/api", () => ({
  fetchAPI: mocks.fetchAPI,
}));

import { authService } from "@/features/auth/services/authService";

describe("Service: authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.auth.currentUser = {
      getIdToken: vi.fn().mockResolvedValue("TOKEN_TESTE"),
    };

    mocks.signInWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: "USER_001",
        email: "gabriel@email.com",
      },
    });

    mocks.createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: "USER_001",
        email: "gabriel@email.com",
      },
    });

    mocks.sendPasswordResetEmail.mockResolvedValue(undefined);
    mocks.signOut.mockResolvedValue(undefined);
    mocks.fetchAPI.mockResolvedValue({ ok: true });
  });

  it("Deve realizar login com e-mail e senha", async () => {
    const resultado = await authService.login("gabriel@email.com", "senha123");

    expect(mocks.signInWithEmailAndPassword).toHaveBeenCalledWith(
      mocks.auth,
      "gabriel@email.com",
      "senha123",
    );

    expect(resultado).toEqual({
      uid: "USER_001",
      email: "gabriel@email.com",
    });
  });

  it("Deve realizar logout", async () => {
    await authService.logout();

    expect(mocks.signOut).toHaveBeenCalledWith(mocks.auth);
  });

  it("Deve enviar e-mail de recuperação de senha", async () => {
    await authService.enviarRecuperacaoSenha("gabriel@email.com");

    expect(mocks.sendPasswordResetEmail).toHaveBeenCalledWith(
      mocks.auth,
      "gabriel@email.com",
    );
  });

  it("Deve validar elegibilidade antes de registrar usuário", async () => {
    await authService.registrarUsuario(
      "Gabriel Sampaio",
      "gabriel@email.com",
      "senha123",
      "111.222.333-44",
    );

    expect(mocks.fetchAPI).toHaveBeenCalledWith(
      "/auth/elegibilidade",
      "POST",
      {
        email: "gabriel@email.com",
      },
      false,
    );
  });

  it("Deve criar usuário no Firebase Auth ao registrar", async () => {
    await authService.registrarUsuario(
      "Gabriel Sampaio",
      "gabriel@email.com",
      "senha123",
      "111.222.333-44",
    );

    expect(mocks.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mocks.auth,
      "gabriel@email.com",
      "senha123",
    );
  });

  it("Deve completar registro no backend após criar usuário", async () => {
    await authService.registrarUsuario(
      "Gabriel Sampaio",
      "gabriel@email.com",
      "senha123",
      "111.222.333-44",
    );

    expect(mocks.fetchAPI).toHaveBeenCalledWith(
      "/auth/completar-registo",
      "POST",
      {
        nome: "Gabriel Sampaio",
        cpf: "111.222.333-44",
      },
      true,
    );
  });

  it("Deve propagar erro quando elegibilidade falhar", async () => {
    mocks.fetchAPI.mockRejectedValueOnce(new Error("Usuário não elegível"));

    await expect(
      authService.registrarUsuario(
        "Gabriel Sampaio",
        "gabriel@email.com",
        "senha123",
        "111.222.333-44",
      ),
    ).rejects.toThrow("Usuário não elegível");

    expect(mocks.createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });
});
