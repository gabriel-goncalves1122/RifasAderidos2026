// ============================================================================
// ARQUIVO: frontend/src/features/auth/hooks/useAuthController.ts
// ============================================================================
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { auth, db } from "@/shared/config/firebase";
import { CargoComissao } from "@/shared/types/models";

import { authService } from "../services/authService";

export interface UsuarioFormatura extends User {
  cargo?: CargoComissao;

  // Nome vem do documento da coleção "usuarios", não obrigatoriamente do Firebase Auth.
  nome?: string;
}

function obterMensagemErroRecuperacao(codigo?: string) {
  if (codigo === "auth/user-not-found" || codigo === "auth/invalid-email") {
    return "E-mail não encontrado ou formato inválido.";
  }

  return "Ocorreu um erro ao enviar o e-mail de recuperação.";
}

function obterMensagemErroRegistro(erro: any) {
  if (erro.message && erro.message.includes("elegível")) {
    return "E-mail não encontrado na base oficial. Use o e-mail exato da Keeper.";
  }

  if (erro.code === "auth/email-already-in-use") {
    return "Este e-mail já possui uma senha. Faça login na tela inicial.";
  }

  return erro.message || "Erro ao criar conta. Verifique os dados.";
}

function normalizarNomeUsuario(dadosUsuario: any) {
  // Mantém compatibilidade com documentos novos e possíveis registros antigos.
  return String(
    dadosUsuario?.nome || dadosUsuario?.Nome || dadosUsuario?.displayName || "",
  ).trim();
}

function normalizarCargoUsuario(dadosUsuario: any): CargoComissao {
  return (dadosUsuario?.cargo as CargoComissao) || "aderido";
}

export function useAuthController() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioFormatura | null>(
    null,
  );

  useEffect(() => {
    let unsubscribeUsuario: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeUsuario?.();

      if (!user?.email) {
        setUsuarioAtual(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const emailNormalizado = user.email.toLowerCase().trim();

      const consultaUsuario = query(
        collection(db, "usuarios"),
        where("email", "==", emailNormalizado),
      );

      unsubscribeUsuario = onSnapshot(
        consultaUsuario,
        (querySnapshot) => {
          const dadosUsuario = !querySnapshot.empty
            ? querySnapshot.docs[0].data()
            : null;

          const cargo = normalizarCargoUsuario(dadosUsuario);
          const nome = normalizarNomeUsuario(dadosUsuario);

          setUsuarioAtual({
            ...user,
            cargo,
            nome,
          } as UsuarioFormatura);

          setLoading(false);
        },
        (erro) => {
          if (import.meta.env.DEV) {
            console.error("[Auth] Erro ao observar usuário:", erro);
          }

          // Mantém o usuário logado com permissão mínima caso o Firestore falhe.
          setUsuarioAtual({
            ...user,
            cargo: "aderido",
            nome: user.displayName || "",
          } as UsuarioFormatura);

          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsuario?.();
    };
  }, []);

  const handleLogin = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, senha);

      // Mantém loading true até o onAuthStateChanged buscar nome e cargo.
      return true;
    } catch (erro) {
      if (import.meta.env.DEV) {
        console.error("[Auth] Erro ao fazer login:", erro);
      }

      setError("E-mail ou senha incorretos.");

      // Corrige o loading infinito quando Firebase rejeita e-mail/senha.
      setLoading(false);

      return false;
    }
  };

  const handleLogout = async () => {
    setError(null);

    try {
      await authService.logout();
    } catch (erro) {
      if (import.meta.env.DEV) {
        console.error("[Auth] Erro ao fazer logout:", erro);
      }
    }
  };

  const handlePasswordReset = async (emailToReset: string) => {
    setLoading(true);
    setError(null);

    try {
      await authService.enviarRecuperacaoSenha(emailToReset);
      return true;
    } catch (erro: any) {
      if (import.meta.env.DEV) {
        console.error("[Auth] Erro na recuperação de senha:", erro);
      }

      setError(obterMensagemErroRecuperacao(erro.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    nome: string,
    email: string,
    senha: string,
    cpf: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await authService.registrarUsuario(nome, email, senha, cpf);
    } catch (erro: any) {
      if (import.meta.env.DEV) {
        console.error("[Auth] Erro no cadastro:", erro);
      }

      setError(obterMensagemErroRegistro(erro));
      throw erro;
    } finally {
      setLoading(false);
    }
  };

  return {
    usuarioAtual,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    handlePasswordReset,
  };
}
