import { auth } from "../config/firebase";

const API_BASE_URL = import.meta.env.PROD
  ? "https://us-central1-rifasaderidos2026.cloudfunctions.net/api/rifas"
  : "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas";

export async function fetchAPI(
  endpoint: string,
  method = "GET",
  body?: any,
  precisaAutenticacao = true,
) {
  try {
    const headers: Record<string, string> = {};

    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (precisaAutenticacao) {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado no sistema.");
      const token = await user.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erro HTTP ${response.status}`);
    }

    return data;
  } catch (err: any) {
    console.error(`Erro na requisição [${method}] ${endpoint}:`, err);
    throw err;
  }
}
