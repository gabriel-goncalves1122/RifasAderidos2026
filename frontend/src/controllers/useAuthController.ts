// ============================================================================
// ARQUIVO: frontend/src/controllers/useAuthController.ts
// ============================================================================
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import { CargoComissao } from "../types/models";
import { fetchAPI } from "./api"; // A nossa nova função mestra!
import { collection, query, where, getDocs } from "firebase/firestore";

export interface UsuarioFormatura extends User {
  cargo?: CargoComissao;
}

export function useAuthController() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioFormatura | null>(
    null,
  );

  // ==========================================================================
  // OBSERVAR ESTADO DO UTILIZADOR
  // ==========================================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          // CORREÇÃO: Como o ID do documento é "ADERIDO_XXX", temos de pesquisar pelo campo email
          const q = query(
            collection(db, "usuarios"),
            where("email", "==", user.email),
          );
          const querySnapshot = await getDocs(q);

          let cargo: CargoComissao = "membro";

          // Se encontrar a ficha do utilizador, extrai o cargo real
          if (!querySnapshot.empty) {
            cargo =
              (querySnapshot.docs[0].data().cargo as CargoComissao) || "membro";
          }

          setUsuarioAtual({ ...user, cargo } as UsuarioFormatura);
        } catch (err) {
          console.error("Erro ao buscar cargo:", err);
          setUsuarioAtual({ ...user, cargo: "membro" } as UsuarioFormatura);
        }
      } else {
        setUsuarioAtual(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ==========================================================================
  // LOGIN
  // ==========================================================================
  const handleLogin = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      return true;
    } catch (err: any) {
      setError("E-mail ou senha incorretos.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {}
  };

  // ==========================================================================
  // REGISTO (Refatorado para usar a API do Backend)
  // ==========================================================================
  const handleRegister = async (
    nome: string,
    email: string,
    senha: string,
    cpf: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      // 1. ANTES DE CRIAR A CONTA: Perguntamos ao nosso Backend se este e-mail é de um aderido oficial
      // Chamamos a rota pública /auth/elegibilidade do nosso Backend
      await fetchAPI("/auth/elegibilidade", "POST", { email }, false);

      // 2. SE O BACKEND AUTORIZOU (não atirou erro): Criamos a conta no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      const user = userCredential.user;

      // 3. AVISAMOS O BACKEND PARA ATUALIZAR A BASE DE DADOS
      // (O Backend pega no token gerado, descobre o UID e preenche a ficha do utilizador com o CPF)
      // Nota: Como já fizemos o createUser, o auth.currentUser já existe, então fetchAPI enviará o token!
      await fetchAPI("/auth/completar-registo", "POST", { nome, cpf }, true);

      return user;
    } catch (err: any) {
      console.error("Erro no cadastro:", err);

      // Tratamento de mensagens amigáveis
      if (err.message && err.message.includes("elegível")) {
        setError(
          "E-mail não encontrado na base oficial. Use o e-mail exato da Keeper.",
        );
      } else if (err.code === "auth/email-already-in-use") {
        setError(
          "Este e-mail já possui uma senha. Faça login na tela inicial.",
        );
      } else {
        setError(err.message || "Erro ao criar conta. Verifique os dados.");
      }
      throw err;
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
  };
}
