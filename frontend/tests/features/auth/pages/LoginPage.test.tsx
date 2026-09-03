// ============================================================================
// ARQUIVO: frontend/tests/features/auth/pages/LoginPage.test.tsx
// ============================================================================
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { useAuthController } from "@/features/auth/hooks/useAuthController";

vi.mock("@/features/auth/hooks/useAuthController", () => ({
  useAuthController: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Página <LoginPage />", () => {
  const mockHandleLogin = vi.fn();
  const mockHandlePasswordReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthController).mockReturnValue({
      handleLogin: mockHandleLogin,
      handlePasswordReset: mockHandlePasswordReset,
      handleRegister: vi.fn(),
      handleLogout: vi.fn(),
      usuarioAtual: null,
      loading: false,
      error: null,
    });
  });

  it("Deve realizar login e navegar para o dashboard", async () => {
    mockHandleLogin.mockResolvedValueOnce(true);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^E-mail/i), {
      target: { value: "gabriel@unifei.br" },
    });

    fireEvent.change(screen.getByLabelText(/^Senha/i, { selector: "input" }), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Acessar sistema/i }));

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(
        "gabriel@unifei.br",
        "senha123",
      );

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("Deve exibir erro quando o controller retornar erro", () => {
    vi.mocked(useAuthController).mockReturnValue({
      handleLogin: mockHandleLogin,
      handlePasswordReset: mockHandlePasswordReset,
      handleRegister: vi.fn(),
      handleLogout: vi.fn(),
      usuarioAtual: null,
      loading: false,
      error: "E-mail ou senha incorretos.",
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("E-mail ou senha incorretos.")).toBeInTheDocument();
  });

  it("Deve abrir o modal de recuperação de senha", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Esqueceu sua senha/i }),
    );

    expect(screen.getByText(/Recuperar senha/i)).toBeInTheDocument();
  });
});
