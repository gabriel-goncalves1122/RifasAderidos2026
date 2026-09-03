// ============================================================================
// ARQUIVO: frontend/tests/features/auth/pages/RegisterPage.test.tsx
// ============================================================================
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { RegisterPage } from "@/features/auth/pages/RegisterPage";
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

describe("Página <RegisterPage />", () => {
  const mockHandleRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthController).mockReturnValue({
      handleRegister: mockHandleRegister,
      handleLogin: vi.fn(),
      handleLogout: vi.fn(),
      handlePasswordReset: vi.fn(),
      usuarioAtual: null,
      loading: false,
      error: null,
    });
  });

  it("Deve disparar o handleRegister com os dados corretos", async () => {
    mockHandleRegister.mockResolvedValueOnce(true);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { value: "Gabriel Sampaio" },
    });

    fireEvent.change(screen.getByLabelText(/E-mail da Keeper/i), {
      target: { value: "gabriel@unifei.br" },
    });

    const inputCpf = screen.getByLabelText(/CPF/i);

    fireEvent.change(inputCpf, {
      target: { value: "11122233344" },
    });

    fireEvent.change(screen.getByLabelText(/Criar senha/i), {
      target: { value: "senhaSegura123" },
    });

    fireEvent.change(screen.getByLabelText(/Confirmar senha/i), {
      target: { value: "senhaSegura123" },
    });

    expect(inputCpf).toHaveValue("111.222.333-44");

    fireEvent.click(
      screen.getByRole("button", { name: /Cadastrar e acessar/i }),
    );

    await waitFor(() => {
      expect(mockHandleRegister).toHaveBeenCalledWith(
        "Gabriel Sampaio",
        "gabriel@unifei.br",
        "senhaSegura123",
        "11122233344",
      );

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
