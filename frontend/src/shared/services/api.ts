// ============================================================================
// ARQUIVO: src/services/api.ts
// ============================================================================
import axios from "axios";
import { auth } from "../shared/config/firebase";

// URLs controladas por ambiente para evitar chamadas acidentais à produção.
const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_LOCAL;

if (import.meta.env.DEV) {
  console.log("[DEV] API:", API_BASE_URL);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Injeta o token Firebase em todas as requisições autenticadas.
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      config.headers.Authorization = `Bearer ${await user.getIdToken()}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Centraliza tratamento de sessão expirada ou usuário sem permissão.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      await auth.signOut();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
