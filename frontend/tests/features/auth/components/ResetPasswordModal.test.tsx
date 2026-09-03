// ============================================================================
// ARQUIVO: frontend/tests/features/auth/components/ResetPasswordModal.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResetPasswordModal } from "@/features/auth/components/ResetPasswordModal";

function renderResetPasswordModal(
  overrides?: Partial<Parameters<typeof ResetPasswordModal>[0]>,
) {
  const props: Parameters<typeof ResetPasswordModal>[0] = {
    open: true,
    resetEmail: "",
    loadingReset: false,
    resetSuccess: false,
    resetError: null,
    setResetEmail: vi.fn(),
    onClose: vi.fn(),
    onResetPassword: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  render(<ResetPasswordModal {...props} />);

  return props;
}

describe("Componente: ResetPasswordModal", () => {
  it("Deve renderizar o modal de recuperação de senha quando aberto", () => {
    renderResetPasswordModal();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/recuperar senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
  });

  it("Não deve renderizar o modal quando open for false", () => {
    renderResetPasswordModal({
      open: false,
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Deve chamar setResetEmail ao digitar no campo de e-mail", async () => {
    const user = userEvent.setup();
    const setResetEmail = vi.fn();

    renderResetPasswordModal({ setResetEmail });

    await user.type(screen.getByLabelText(/e-mail/i), "g");

    expect(setResetEmail).toHaveBeenCalled();
  });

  it("Deve chamar onResetPassword ao clicar no botão de envio", async () => {
    const user = userEvent.setup();
    const onResetPassword = vi.fn().mockResolvedValue(undefined);

    renderResetPasswordModal({
      resetEmail: "gabriel@email.com",
      onResetPassword,
    });

    await user.click(
      screen.getByRole("button", {
        name: /enviar/i,
      }),
    );

    expect(onResetPassword).toHaveBeenCalledTimes(1);
  });

  it("Deve chamar onClose ao clicar no botão de cancelar", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderResetPasswordModal({ onClose });

    await user.click(
      screen.getByRole("button", {
        name: /cancelar/i,
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Deve exibir mensagem de sucesso quando resetSuccess for true", () => {
    renderResetPasswordModal({
      resetSuccess: true,
    });

    expect(screen.getByText(/link enviado com sucesso/i)).toBeInTheDocument();

    expect(
      screen.getByText(/verifique sua caixa de entrada/i),
    ).toBeInTheDocument();
  });

  it("Deve exibir mensagem de erro quando resetError for informado", () => {
    renderResetPasswordModal({
      resetError: "E-mail inválido.",
    });

    expect(screen.getByText("E-mail inválido.")).toBeInTheDocument();
  });

  it("Deve bloquear campo e ações quando loadingReset for true", () => {
    renderResetPasswordModal({
      loadingReset: true,
    });

    expect(screen.getByLabelText(/e-mail/i)).toBeDisabled();
  });
});
