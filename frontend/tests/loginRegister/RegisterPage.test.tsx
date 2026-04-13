import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { RegisterPage } from "../../src/views/pages/RegisterPage";
import { useAuthController } from "../../src/controllers/useAuthController";

vi.mock("../../src/controllers/useAuthController", () => ({
  useAuthController: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Página <RegisterPage />", () => {
  const mockHandleRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthController as any).mockReturnValue({
      handleRegister: mockHandleRegister,
      loading: false,
      error: null,
    });
  });

  it("Deve disparar a função handleRegister com os dados corretamente mascarados", async () => {
    mockHandleRegister.mockResolvedValueOnce(true);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    // Preenchendo o formulário
    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: "Gabriel Sampaio" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail da Keeper/i), {
      target: { value: "gabriel@unifei.br" },
    });

    // Escrevemos o CPF só com números, o onChange do componente deve formatar!
    const inputCpf = screen.getByLabelText(/CPF/i);
    fireEvent.change(inputCpf, { target: { value: "11122233344" } });
    fireEvent.change(screen.getByLabelText(/Criar Senha/i), {
      target: { value: "senhaSegura123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar Senha/i), {
      target: { value: "senhaSegura123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Cadastrar e Acessar/i }),
    );

    await waitFor(() => {
      // Repare como esperamos que o CPF chegue formatado à função!
      expect(mockHandleRegister).toHaveBeenCalledWith(
        "Gabriel Sampaio",
        "gabriel@unifei.br",
        "senhaSegura123",
        "111.222.333-44",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
