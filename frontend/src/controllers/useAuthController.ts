// ============================================================================
// ARQUIVO: useAuthController.ts (Controlador de Sessão e Cargos)
// ============================================================================
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut, // Importação necessária para a interface
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

// Importamos o tipo oficial que acabamos de definir no models.ts
import { CargoComissao } from "../types/models";

// ----------------------------------------------------------------------------
// 1. INTERFACE DE USUÁRIO TURBINADA
// ----------------------------------------------------------------------------
// Unimos as informações nativas do Firebase (email, uid) com o nosso 'cargo'
export interface UsuarioFormatura extends User {
  cargo?: CargoComissao;
}

export function useAuthController() {
  // Iniciamos com loading true para o PrivateRoute saber que estamos checando o banco
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioFormatura | null>(
    null,
  );

  // ----------------------------------------------------------------------------
  // 2. OBSERVADOR DE AUTENTICAÇÃO (Limpo e Otimizado)
  // ----------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          // Busca o documento do usuário pelo e-mail
          const q = query(
            collection(db, "usuarios"),
            where("email", "==", user.email),
          );
          const querySnapshot = await getDocs(q);

          let cargo: CargoComissao = "membro";

          if (!querySnapshot.empty) {
            const dadosDoBanco = querySnapshot.docs[0].data();
            cargo = (dadosDoBanco.cargo as CargoComissao) || "membro";
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
  // ----------------------------------------------------------------------------
  // 3. AÇÕES (Login e Cadastro)
  // ----------------------------------------------------------------------------

  const handleLogin = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      return true;
    } catch (err: any) {
      console.error(err);
      setError("E-mail ou senha incorretos.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao sair da conta:", err);
    }
  };

  const handleRegister = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);
    try {
      // Validação de elegibilidade no Backend (Porteiro)
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

      // Se elegível, cria no Firebase Auth
      await createUserWithEmailAndPassword(auth, email, senha);
      return true;
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já possui conta.");
      } else {
        setError(err.message || "Erro ao criar conta.");
      }
      return false;
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
    handleLogout, // <--- Faltava isso aqui!
  };
}
