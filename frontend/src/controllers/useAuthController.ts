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
import { fetchAPI } from "./api";
// IMPORTANTE: Trocámos o getDocs pelo onSnapshot para ter atualizações em Tempo Real!
import { collection, query, where, onSnapshot } from "firebase/firestore";

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
  // OBSERVAR ESTADO DO UTILIZADOR (AGORA EM TEMPO REAL)
  // ==========================================================================
  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const q = query(
          collection(db, "usuarios"),
          where("email", "==", user.email),
        );

        // A MÁGICA ACONTECE AQUI: O onSnapshot fica "ouvindo" o banco de dados 24/7
        unsubscribeSnapshot = onSnapshot(
          q,
          (querySnapshot) => {
            let cargo: CargoComissao = "aderido"; // Padrão seguro

            // Se encontrar a ficha do utilizador, extrai o cargo em tempo real
            if (!querySnapshot.empty) {
              cargo =
                (querySnapshot.docs[0].data().cargo as CargoComissao) ||
                "aderido";
            }

            setUsuarioAtual({ ...user, cargo } as UsuarioFormatura);
            setLoading(false); // Só desliga o loading quando tiver a certeza do cargo
          },
          (err) => {
            console.error("Erro ao ouvir cargo em tempo real:", err);
            setUsuarioAtual({ ...user, cargo: "aderido" } as UsuarioFormatura);
            setLoading(false);
          },
        );
      } else {
        // Se não houver utilizador logado (ou fez logout)
        setUsuarioAtual(null);
        setLoading(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot(); // Desliga a "câmara de vigilância"
      }
    });

    // Limpeza quando o componente é destruído
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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
      // Nota: Não desligamos o loading aqui porque o onAuthStateChanged vai assumir o controlo
    }
  };

  // ==========================================================================
  // LOGOUT
  // ==========================================================================
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  // ==========================================================================
  // REGISTO (Usando a API do Backend)
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
      // 1. Pergunta ao Backend se este e-mail é de um aderido oficial
      await fetchAPI("/auth/elegibilidade", "POST", { email }, false);

      // 2. Se o backend autorizou, cria a conta no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      const user = userCredential.user;

      // 3. Avisa o backend para atualizar a base de dados com o CPF e Nome
      await fetchAPI("/auth/completar-registo", "POST", { nome, cpf }, true);

      return user;
    } catch (err: any) {
      console.error("Erro no cadastro:", err);

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
