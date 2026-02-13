// Adicione as funções do Vitest aqui nesta importação:
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";

// ... o resto do seu código de mock e os testes continuam exatamente iguais ...
// 1. MOCK (Arrange):
// O frontend não deve bater no Firebase de verdade durante o teste de componente.
// Vamos simular o seu hook de autenticação.
const mockHandleLogin = vi.fn();

vi.mock("../../controllers/useAuthController", () => ({
  useAuthController: () => ({
    handleLogin: mockHandleLogin,
    error: null,
    loading: false,
  }),
}));

// Um wrapper para fornecer o contexto de rotas que a página de login precisa
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Tela de Login (LoginPage)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TESTE 1: Renderização inicial
  it("Deve renderizar os campos de email, senha e o botão", () => {
    renderWithRouter(<LoginPage />);

    // Verifica se os elementos estão na tela (buscando como um usuário faria: lendo textos e labels)
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /acessar sistema/i }),
    ).toBeInTheDocument();
  });

  // TESTE 2: Comportamento (Yup Validation)
  it("Deve exibir erro de validação do Yup se tentar logar com campos vazios", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const botaoLogin = screen.getByRole("button", { name: /acessar sistema/i });

    // Ação (Act): Usuário clica no botão sem preencher nada
    await user.click(botaoLogin);

    // Verificação (Assert): Aguarda o React Hook Form processar o Yup e exibir os erros na tela
    // ... (dentro do TESTE 2)
    await waitFor(() => {
      expect(screen.getByText("E-mail é obrigatório")).toBeInTheDocument();
      // Correção com o texto exato que aparece na tela:
      expect(
        screen.getByText("A senha deve ter no mínimo 6 caracteres"),
      ).toBeInTheDocument();
    });
    // O Controller (Firebase) NÃO pode ter sido chamado!
    expect(mockHandleLogin).not.toHaveBeenCalled();
  });

  // TESTE 3: Caminho Feliz
  it("Deve chamar o handleLogin se os dados estiverem preenchidos corretamente", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const inputEmail = screen.getByLabelText(/endereço de e-mail/i);
    const inputSenha = screen.getByLabelText(/senha/i);
    const botaoLogin = screen.getByRole("button", { name: /acessar sistema/i });

    // Ação (Act): Usuário digita os dados e clica
    await user.type(inputEmail, "engenheiro@unifei.edu.br");
    await user.type(inputSenha, "senhaSegura123");
    await user.click(botaoLogin);

    // Verificação (Assert): O form passou no Yup e o Firebase foi chamado com os dados certos
    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(
        "engenheiro@unifei.edu.br",
        "senhaSegura123",
      );
    });
  });
});
