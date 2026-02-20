import { useState } from "react";
import { auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export function useAuthController() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FUNÇÃO 1: LOGIN (Atualizada)
  const handleLogin = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      return true; // <-- ADICIONADO: Avisa a tela que deu certo!
    } catch (err: any) {
      console.error(err);
      setError("E-mail ou senha incorretos.");
      return false; // <-- ADICIONADO: Avisa a tela que falhou!
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO 2: CADASTRO (Blindada)
  const handleRegister = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Pergunta ao Backend se esse e-mail é de um formando oficial
      // (Ajuste a URL para a sua rota real do emulador/servidor)
      const response = await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/auth/verificar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao verificar elegibilidade.");
      }

      // 2. Se a API autorizou, criamos a conta no Firebase de verdade!
      await createUserWithEmailAndPassword(auth, email, senha);
      return true;
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já possui conta. Volte e faça login.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha é muito fraca. Escolha uma mais forte.");
      } else {
        // Exibe o erro do nosso Backend (Ex: Intruso bloqueado)
        setError(err.message || "Erro ao criar conta. Tente novamente.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, error, loading };
}
