import { auth } from "../config/firebase";

const API_BASE_URL = (import.meta as any).env.PROD
  ? "https://us-central1-rifasaderidos2026.cloudfunctions.net/api" // Voltou para us-central1
  : "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api";

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

    const options: RequestInit = { method, headers, cache: "no-store" };

    // CORREÇÃO: Se for FormData (arquivo), envia puro. Se for objeto normal, converte para JSON.
    if (body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // ========================================================================
    // CORREÇÃO: Lemos como texto primeiro para não estoirar se o servidor devolver HTML (Ex: 404 ou 502)
    // ========================================================================
    const rawText = await response.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.warn(
        "Aviso: A resposta da API não é um JSON válido. Retorno bruto:",
        rawText,
      );
      data = {
        error: `Resposta inesperada do servidor (HTML/Texto) - Status: ${response.status}`,
      };
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        await auth.signOut();
        window.location.href = "/login"; // Força o utilizador a voltar ao início
        throw new Error(
          "A sua sessão expirou. Por favor, faça login novamente.",
        );
      }
      throw new Error(data.error || `Erro HTTP ${response.status}`);
    }

    return data;
  } catch (err: any) {
    console.error(`Erro na requisição [${method}] ${endpoint}:`, err);
    throw err;
  }
}
