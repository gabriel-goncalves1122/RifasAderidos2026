// ============================================================================
// ARQUIVO: useAuthController.ts (Controlador de Sessão e Cargos)
// ============================================================================
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User, // Importação necessária para a interface
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
  // 2. OBSERVADOR DE AUTENTICAÇÃO (O Olheiro)
  // ----------------------------------------------------------------------------
  useEffect(() => {
    // Escuta mudanças no login (login, logout, refresh)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Quando o usuário loga, buscamos o documento dele para saber o cargo
          // Usamos o UID como chave no Firestore
          const docSnap = await getDoc(doc(db, "usuarios", user.uid));
          let cargo: CargoComissao = "membro"; // Padrão caso não exista no doc

          if (docSnap.exists()) {
            cargo = (docSnap.data().cargo as CargoComissao) || "membro";
          }

          // Combinamos os dados: Firebase Auth + Cargo do Firestore
          setUsuarioAtual({ ...user, cargo } as UsuarioFormatura);
        } catch (err) {
          console.error("Erro ao buscar cargo:", err);
          setUsuarioAtual({ ...user, cargo: "membro" } as UsuarioFormatura);
        }
      } else {
        setUsuarioAtual(null);
      }
      setLoading(false); // Libera a tela após a verificação
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

  return { handleLogin, handleRegister, error, loading, usuarioAtual };
}
