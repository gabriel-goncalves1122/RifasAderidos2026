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
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { CargoComissao } from "../types/models";

export interface UsuarioFormatura extends User {
  cargo?: CargoComissao;
}

export function useAuthController() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioFormatura | null>(
    null,
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        try {
          const q = query(
            collection(db, "usuarios"),
            where("email", "==", user.email),
          );
          const querySnapshot = await getDocs(q);
          let cargo: CargoComissao = "membro";
          if (!querySnapshot.empty) {
            cargo =
              (querySnapshot.docs[0].data().cargo as CargoComissao) || "membro";
          }
          setUsuarioAtual({ ...user, cargo } as UsuarioFormatura);
        } catch (err) {
          setUsuarioAtual({ ...user, cargo: "membro" } as UsuarioFormatura);
        }
      } else {
        setUsuarioAtual(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {}
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
      // 1. PRIMEIRO PASSO: Cria a conta no Firebase Auth para ganharmos o "crachá" de acesso
      // (Isso já faz o login do usuário "por baixo dos panos" automaticamente)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      const user = userCredential.user;

      // 2. SEGUNDO PASSO: Agora que estamos logados e com permissão, buscamos a ficha da Keeper
      const q = query(
        collection(db, "usuarios"),
        where("email", "==", user.email),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(
          "E-mail não encontrado na base da comissão. Use o e-mail exato da Keeper.",
        );
      }

      // Descobrimos quem é o aderido (Ex: ADERIDO_001)
      const aderidoDoc = querySnapshot.docs[0];

      // 3. TERCEIRO PASSO: MÁGICA FINAL! Atualiza a ficha ADERIDO_XXX conectando tudo
      await updateDoc(doc(db, "usuarios", aderidoDoc.id), {
        uid: user.uid, // Conecta com a conta que acabamos de criar
        cpf: cpf, // Salva o CPF validado
        nome: nome, // Garante que o nome do relatório será o digitado
      });

      return user;
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      if (err.message && err.message.includes("E-mail não encontrado")) {
        setError(err.message);
      } else if (err.code === "auth/email-already-in-use") {
        setError(
          "Este e-mail já possui uma senha. Faça login na tela inicial.",
        );
      } else {
        setError("Erro ao criar conta. Verifique os dados.");
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
