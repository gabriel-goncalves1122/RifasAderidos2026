import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { RegisterPage } from "../src/views/pages/RegisterPage";

const mocks = vi.hoisted(() => ({
  handleRegister: vi.fn(),
}));

vi.mock("../src/controllers/useAuthController", () => ({
  useAuthController: () => ({
    handleRegister: mocks.handleRegister,
    error: null,
    loading: false,
  }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Tela de Cadastro (RegisterPage)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Deve renderizar os campos de cadastro e o aviso da Keeper", () => {
    renderWithRouter(<RegisterPage />);
    expect(
      screen.getByText(/exatamente o mesmo e-mail que utilizou/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail da Keeper/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Criar Senha/i)).toBeInTheDocument();
  });

  it("Deve acionar o handleRegister ao preencher os dados corretamente", async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterPage />);

    await user.type(
      screen.getByLabelText(/E-mail da Keeper/i),
      "engenheiro@unifei.edu.br",
    );
    await user.type(screen.getByLabelText(/^Criar Senha/i), "senhaForte123");
    await user.type(screen.getByLabelText(/Confirmar Senha/i), "senhaForte123");

    await user.click(
      screen.getByRole("button", { name: /Cadastrar e Ver Rifas/i }),
    );

    await waitFor(() => {
      expect(mocks.handleRegister).toHaveBeenCalledWith(
        "engenheiro@unifei.edu.br",
        "senhaForte123",
      );
    });
  });
});
