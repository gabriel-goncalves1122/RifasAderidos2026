// ============================================================================
// ARQUIVO: frontend/tests/features/auth/components/RegisterForm.test.tsx
// ============================================================================
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { RegisterForm } from "@/features/auth/components/RegisterForm";

function renderRegisterForm(
  overrides?: Partial<Parameters<typeof RegisterForm>[0]>,
) {
  const props: Parameters<typeof RegisterForm>[0] = {
    error: null,
    showPassword: false,
    showConfirmPassword: false,
    isUIBlocked: false,
    onSubmit: vi.fn().mockResolvedValue(undefined),
    onTogglePassword: vi.fn(),
    onToggleConfirmPassword: vi.fn(),
    ...overrides,
  };

  render(
    <MemoryRouter>
      <RegisterForm {...props} />
    </MemoryRouter>,
  );

  return props;
}

describe("Componente: RegisterForm", () => {
  it("Deve renderizar os campos principais do cadastro", () => {
    renderRegisterForm();

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail da keeper/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^criar senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /cadastrar e acessar/i }),
    ).toBeInTheDocument();
  });

  it("Deve exibir mensagem de erro quando recebida por props", () => {
    renderRegisterForm({
      error: "E-mail não encontrado na base oficial.",
    });

    expect(
      screen.getByText("E-mail não encontrado na base oficial."),
    ).toBeInTheDocument();
  });

  it("Deve aplicar máscara no CPF durante a digitação", async () => {
    const user = userEvent.setup();

    renderRegisterForm();

    await user.type(screen.getByLabelText(/cpf/i), "11122233344");

    expect(screen.getByLabelText(/cpf/i)).toHaveValue("111.222.333-44");
  });

  it("Deve chamar onSubmit ao enviar o formulário", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderRegisterForm({ onSubmit });

    await user.type(screen.getByLabelText(/nome completo/i), "Gabriel Sampaio");
    await user.type(
      screen.getByLabelText(/e-mail da keeper/i),
      "gabriel@email.com",
    );
    await user.type(screen.getByLabelText(/cpf/i), "11122233344");
    await user.type(screen.getByLabelText(/^criar senha/i), "senha123");
    await user.type(screen.getByLabelText(/confirmar senha/i), "senha123");

    await user.click(
      screen.getByRole("button", { name: /cadastrar e acessar/i }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("Deve chamar onTogglePassword ao clicar no botão de visibilidade da senha", async () => {
    const user = userEvent.setup();
    const onTogglePassword = vi.fn();

    renderRegisterForm({ onTogglePassword });

    await user.click(
      screen.getByRole("button", {
        name: /mostrar senha/i,
      }),
    );

    expect(onTogglePassword).toHaveBeenCalledTimes(1);
  });

  it("Deve chamar onToggleConfirmPassword ao clicar no botão de visibilidade da confirmação", async () => {
    const user = userEvent.setup();
    const onToggleConfirmPassword = vi.fn();

    renderRegisterForm({ onToggleConfirmPassword });

    await user.click(
      screen.getByRole("button", {
        name: /mostrar confirmação/i,
      }),
    );

    expect(onToggleConfirmPassword).toHaveBeenCalledTimes(1);
  });

  it("Deve bloquear campos quando a UI estiver bloqueada", () => {
    renderRegisterForm({
      isUIBlocked: true,
    });

    expect(screen.getByLabelText(/nome completo/i)).toBeDisabled();
    expect(screen.getByLabelText(/e-mail da keeper/i)).toBeDisabled();
    expect(screen.getByLabelText(/cpf/i)).toBeDisabled();
    expect(screen.getByLabelText(/^criar senha/i)).toBeDisabled();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeDisabled();
  });
});
