// ============================================================================
// ARQUIVO: frontend/src/features/auth/services/authService.ts
// ============================================================================
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/shared/config/firebase";
import { fetchAPI } from "@/controllers/api";

export const authService = {
  async login(email: string, senha: string) {
    const credencial = await signInWithEmailAndPassword(auth, email, senha);
    return credencial.user;
  },

  async logout() {
    await signOut(auth);
  },

  async enviarRecuperacaoSenha(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  async registrarUsuario(
    nome: string,
    email: string,
    senha: string,
    cpf: string,
  ) {
    // Confirma no backend se o e-mail pertence à base oficial da comissão.
    await fetchAPI("/auth/elegibilidade", "POST", { email }, false);

    const credencial = await createUserWithEmailAndPassword(auth, email, senha);

    // Completa o cadastro do usuário autenticado no banco.
    await fetchAPI("/auth/completar-registo", "POST", { nome, cpf }, true);

    return credencial.user;
  },
};
