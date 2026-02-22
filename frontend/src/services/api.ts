// ============================================================================
// ARQUIVO: src/services/api.ts
// ============================================================================
import axios from "axios";
import { auth } from "../config/firebase";

// ============================================================================
// 1. URL DINÂMICA (A mágica que resolve o erro de CORS na internet)
// O Vite descobre se estamos a rodar localmente ou se já estamos na nuvem.
// ============================================================================
const API_BASE_URL = import.meta.env.PROD
  ? "https://us-central1-rifasaderidos2026.cloudfunctions.net/api"
  : "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api";

// 2. Cria a instância do Axios apontando para a URL correta automaticamente
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ============================================================================
// 3. INTERCEPTOR DE REQUISIÇÃO (Segurança Automatizada)
// ============================================================================
// Este bloco intercepta TODAS as requisições que saem do frontend antes de
// irem para a internet, injetando o "crachá" (Token JWT) do utilizador.
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      // Pega o token atualizado (o Firebase renova sozinho se estiver expirado)
      const token = await user.getIdToken();

      // Injeta no cabeçalho no formato esperado pelo nosso middleware do backend
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
