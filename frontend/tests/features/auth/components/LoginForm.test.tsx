// ============================================================================
// ARQUIVO: frontend/tests/features/auth/components/LoginForm.test.tsx
// ============================================================================
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { LoginForm } from "@/features/auth/components/LoginForm";

function renderLoginForm(overrides?: Partial<Parameters<typeof LoginForm>[0]>) {
  const props: Parameters<typeof LoginForm>[0] = {
    error: null,
    showPassword: false,
    isUIBlocked: false,
    onSubmit: vi.fn().mockResolvedValue(undefined),
    onTogglePassword: vi.fn(),
    onOpenResetPassword: vi.fn(),
    ...overrides,
  };

  render(
    <MemoryRouter>
      <LoginForm {...props} />
    </MemoryRouter>,
  );

  return props;
}

describe("Componente: LoginForm", () => {
  it("Deve renderizar os campos e ações principais do login", () => {
    renderLoginForm();

    expect(
      screen.getByRole("textbox", { name: /e-mail/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/^senha\s*\*?$/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /acessar sistema/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /esqueceu sua senha/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /registre-se aqui/i }),
    ).toBeInTheDocument();
  });

  it("Deve exibir mensagem de erro quando recebida por props", () => {
    renderLoginForm({
      error: "E-mail ou senha incorretos.",
    });

    expect(screen.getByText("E-mail ou senha incorretos.")).toBeInTheDocument();
  });

  it("Deve chamar onSubmit com e-mail e senha válidos", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderLoginForm({ onSubmit });

    await user.type(
      screen.getByRole("textbox", { name: /e-mail/i }),
      "gabriel@email.com",
    );

    await user.type(screen.getByLabelText(/^senha\s*\*?$/i), "senha123");

    await user.click(screen.getByRole("button", { name: /acessar sistema/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("Deve chamar onTogglePassword ao clicar no botão de visibilidade da senha", async () => {
    const user = userEvent.setup();
    const onTogglePassword = vi.fn();

    renderLoginForm({ onTogglePassword });

    await user.click(
      screen.getByRole("button", {
        name: /mostrar senha/i,
      }),
    );

    expect(onTogglePassword).toHaveBeenCalledTimes(1);
  });

  it("Deve chamar onOpenResetPassword ao clicar em Esqueceu sua senha", async () => {
    const user = userEvent.setup();
    const onOpenResetPassword = vi.fn();

    renderLoginForm({ onOpenResetPassword });

    await user.click(
      screen.getByRole("button", {
        name: /esqueceu sua senha/i,
      }),
    );

    expect(onOpenResetPassword).toHaveBeenCalledTimes(1);
  });

  it("Deve bloquear campos e ações quando a UI estiver bloqueada", () => {
    renderLoginForm({
      isUIBlocked: true,
    });

    expect(screen.getByRole("textbox", { name: /e-mail/i })).toBeDisabled();

    expect(screen.getByLabelText(/^senha\s*\*?$/i)).toBeDisabled();

    expect(
      screen.getByRole("button", { name: /mostrar senha/i }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: /esqueceu sua senha/i }),
    ).toBeDisabled();

    expect(screen.getByRole("button", { name: "" })).toBeDisabled();
  });
});
