import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { RegisterPage } from "../src/views/pages/RegisterPage";

// Mock do Controller de Autenticação
vi.mock("../src/controllers/useAuthController", () => ({
  useAuthController: vi.fn(),
}));
import { useAuthController } from "../src/controllers/useAuthController";

describe("RegisterPage", () => {
  const mockHandleRegister = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuthController).mockReturnValue({
      handleRegister: mockHandleRegister,
      handleLogin: vi.fn(),
      handleLogout: vi.fn(),
      usuarioAtual: null,
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("Deve acionar o handleRegister ao preencher os dados corretamente (incluindo Nome e CPF)", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>,
    );

    // Seleciona os campos (Agora incluindo o Nome)
    const inputNome = screen.getByLabelText(/Nome Completo/i);
    const inputEmail = screen.getByLabelText(/E-mail da Keeper/i);
    const inputCpf = screen.getByLabelText(/CPF/i);
    const inputSenha = screen.getByLabelText(/^Criar Senha/i);
    const inputConfirmaSenha = screen.getByLabelText(/Confirmar Senha/i);
    const btnSubmit = screen.getByRole("button", {
      name: /Cadastrar e Acessar/i, // <-- Atualizamos o texto aqui!
    });

    // Preenche os dados completos
    await user.type(inputNome, "Gabriel Gonçalves Sampaio"); // <--- O robô agora digita o nome!
    await user.type(inputEmail, "teste@unifei.br");
    await user.type(inputCpf, "11122233344");
    await user.type(inputSenha, "senha123");
    await user.type(inputConfirmaSenha, "senha123");

    // Valida se a máscara de CPF funcionou na tela
    expect(inputCpf).toHaveValue("111.222.333-44");

    // Envia o formulário
    await user.click(btnSubmit);

    // Verifica se o controller foi chamado com os 4 parâmetros corretos na ordem certa
    await waitFor(() => {
      expect(mockHandleRegister).toHaveBeenCalledWith(
        "Gabriel Gonçalves Sampaio", // 1º Nome
        "teste@unifei.br", // 2º Email
        "senha123", // 3º Senha
        "111.222.333-44", // 4º CPF
      );
    });
  });
});
