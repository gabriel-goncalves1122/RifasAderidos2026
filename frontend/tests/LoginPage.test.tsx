// ============================================================================
// ARQUIVO: LoginPage.test.tsx (Testes de Componente do Frontend)
// ============================================================================

import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "../src/views/pages/LoginPage";

// ----------------------------------------------------------------------------
// 1. ELEVAÇÃO E FALSIFICAÇÃO (HOISTING & MOCKING)
// ----------------------------------------------------------------------------
// O Vitest compila o código de forma muito rápida. O "vi.hoisted" garante que
// a nossa função "espiã" (vi.fn) seja criada ANTES da tela do React sequer existir.
const mocks = vi.hoisted(() => ({
  handleLogin: vi.fn(), // Função vazia que vai apenas anotar se foi chamada
}));

// Interceptamos a importação do Controller do Frontend.
// Em vez de bater no Firebase real e gastar rede, a tela vai usar nossa função espiã.
vi.mock("../src/controllers/useAuthController", () => ({
  useAuthController: () => ({
    handleLogin: mocks.handleLogin,
    error: null,
    loading: false,
  }),
}));

// ----------------------------------------------------------------------------
// 2. FUNÇÃO AUXILIAR (HELPER)
// ----------------------------------------------------------------------------
// Como a nossa tela de Login usa navegação (useNavigate), o React exige que
// ela esteja envelopada por um roteador, senão ele lança um erro.
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Tela de Login (LoginPage)", () => {
  // Limpa o histórico das nossas funções espiãs antes de CADA teste rodar.
  // Evita que os dados de um teste "vazem" e estraguem o próximo.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // TESTE 1: RENDERIZAÇÃO VISUAL (Smoke Test)
  // ========================================================================
  it("Deve renderizar os campos de email, senha e o botão na tela", () => {
    // Arrange: Renderiza a tela virtualmente
    renderWithRouter(<LoginPage />);

    // Assert: O "screen" lê o DOM virtual igual a um leitor de tela para deficientes visuais.
    // Usamos expressões regulares (/texto/i) para ignorar letras maiúsculas/minúsculas.
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /acessar sistema/i }),
    ).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 2: VALIDAÇÃO DE ERROS (Yup / React Hook Form)
  // ========================================================================
  it("Deve exibir erro de validação do Yup se tentar logar com campos vazios", async () => {
    // Arrange: Prepara o "userEvent", que simula uma pessoa real usando teclado e mouse.
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    // Act: Acha o botão e dá um clique (ação assíncrona, demora uns milissegundos)
    const botaoLogin = screen.getByRole("button", { name: /acessar sistema/i });
    await user.click(botaoLogin);

    // Assert: Como o Yup leva um tempinho para validar, usamos "waitFor"
    // para o teste não dar erro por impaciência. Ele fica checando até a frase aparecer.
    await waitFor(() => {
      expect(screen.getByText("E-mail é obrigatório")).toBeInTheDocument();
      expect(
        screen.getByText("A senha deve ter no mínimo 6 caracteres"),
      ).toBeInTheDocument();
    });

    // Assert de Segurança: Garante que a nossa função de login NUNCA foi chamada,
    // pois a validação do formulário a bloqueou.
    expect(mocks.handleLogin).not.toHaveBeenCalled();
  });

  // ========================================================================
  // TESTE 3: CAMINHO FELIZ (Integração do Form com o Controller)
  // ========================================================================
  it("Deve chamar o handleLogin se os dados estiverem preenchidos corretamente", async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const inputEmail = screen.getByLabelText(/endereço de e-mail/i);
    const inputSenha = screen.getByLabelText(/senha/i);
    const botaoLogin = screen.getByRole("button", { name: /acessar sistema/i });

    // Act: Usuário digita os dados letra por letra (user.type) e depois clica.
    await user.type(inputEmail, "engenheiro@unifei.edu.br");
    await user.type(inputSenha, "senhaSegura123");
    await user.click(botaoLogin);

    // Assert: O form passou no Yup. Verificamos se a nossa função espiã foi
    // acionada recebendo exatamente os dados que o usuário digitou!
    await waitFor(() => {
      expect(mocks.handleLogin).toHaveBeenCalledWith(
        "engenheiro@unifei.edu.br",
        "senhaSegura123",
      );
    });
  });
});
