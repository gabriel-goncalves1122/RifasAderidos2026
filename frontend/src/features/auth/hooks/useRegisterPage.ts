// ============================================================================
// ARQUIVO: frontend/src/features/auth/hooks/useRegisterPage.ts
// ============================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { RegisterFormData } from "../schemas/registerSchema";
import { useAuthController } from "./useAuthController";

export function useRegisterPage() {
  const navigate = useNavigate();

  const { handleRegister, error, loading } = useAuthController();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUIBlocked = loading || isSubmitting;

  const alternarSenha = () => {
    setShowPassword((estadoAtual) => !estadoAtual);
  };

  const alternarConfirmacaoSenha = () => {
    setShowConfirmPassword((estadoAtual) => !estadoAtual);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      await handleRegister(data.nome, data.email, data.senha, data.cpf);
      navigate("/dashboard");
    } finally {
      // Evita loading infinito se cadastro, elegibilidade ou Firebase falharem.
      setIsSubmitting(false);
    }
  };

  return {
    error,
    isUIBlocked,
    showPassword,
    showConfirmPassword,
    alternarSenha,
    alternarConfirmacaoSenha,
    onSubmit,
  };
}
