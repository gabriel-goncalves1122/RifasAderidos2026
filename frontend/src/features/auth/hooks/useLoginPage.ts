// ============================================================================
// ARQUIVO: frontend/src/features/auth/hooks/useLoginPage.ts
// ============================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginFormData } from "../schemas/loginSchema";
import { useAuthController } from "./useAuthController";

export function useLoginPage() {
  const navigate = useNavigate();

  const { handleLogin, handlePasswordReset, error, loading } =
    useAuthController();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openResetModal, setOpenResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [loadingReset, setLoadingReset] = useState(false);

  const isUIBlocked = loading || isSubmitting;

  const alternarVisibilidadeSenha = () => {
    setShowPassword((estadoAtual) => !estadoAtual);
  };

  const abrirModalReset = () => {
    setResetError(null);
    setResetSuccess(false);
    setOpenResetModal(true);
  };

  const fecharModalReset = () => {
    if (loadingReset) return;

    setOpenResetModal(false);
    setResetError(null);
    setResetSuccess(false);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const sucesso = await handleLogin(data.email, data.password);

      if (sucesso) {
        navigate("/dashboard");
      }
    } finally {
      // Garante que a tela não fica travada se o login falhar.
      setIsSubmitting(false);
    }
  };

  const onResetPassword = async () => {
    if (!resetEmail || loadingReset) return;

    setLoadingReset(true);
    setResetError(null);

    try {
      const sucesso = await handlePasswordReset(resetEmail);

      if (!sucesso) {
        setResetError("Ocorreu um erro ao enviar. Verifique o seu e-mail.");
        return;
      }

      setResetSuccess(true);

      window.setTimeout(() => {
        setOpenResetModal(false);
        setResetSuccess(false);
        setResetEmail("");
      }, 3000);
    } catch (erro) {
      console.error(
        "[LoginPage] Erro ao solicitar recuperação de senha:",
        erro,
      );

      setResetError("Ocorreu um erro ao enviar. Verifique o seu e-mail.");
    } finally {
      setLoadingReset(false);
    }
  };

  return {
    error,
    loading,
    showPassword,
    isSubmitting,
    isUIBlocked,

    openResetModal,
    resetEmail,
    resetSuccess,
    resetError,
    loadingReset,

    setResetEmail,
    alternarVisibilidadeSenha,
    abrirModalReset,
    fecharModalReset,
    onSubmit,
    onResetPassword,
  };
}
