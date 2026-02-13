// src/services/api.ts
import axios from "axios";
import { auth } from "../config/firebase";

// 1. Cria a instância apontando para o seu emulador local
export const api = axios.create({
  baseURL: "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api",
});

// 2. Interceptor de Requisição
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      // Pega o token (o Firebase renova automaticamente se estiver expirado)
      const token = await user.getIdToken();

      // Injeta no cabeçalho no formato esperado pelo nosso backend
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
