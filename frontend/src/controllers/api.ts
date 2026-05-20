import { auth } from "../shared/config/firebase";

const API_BASE_URL = import.meta.env.PROD
  ? "https://us-central1-rifasaderidos2026.cloudfunctions.net/api"
  : "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api";

if (import.meta.env.DEV) {
  console.log("🔥 Frontend em modo DEV");
  console.log("🔗 API_BASE_URL:", API_BASE_URL);
}

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

      if (!user) {
        throw new Error("Usuário não autenticado no sistema.");
      }

      const token = await user.getIdToken();

      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      cache: "no-store",
    };

    if (body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    if (import.meta.env.DEV) {
      console.log(`[API DEV] ${method} ${url}`);
    }

    const response = await fetch(url, options);

    const rawText = await response.text();

    let data;

    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      console.warn(
        "Aviso: A resposta da API não é um JSON válido. Retorno bruto:",
        rawText,
      );

      data = {
        error: `Resposta inesperada do servidor - Status: ${response.status}`,
      };
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        await auth.signOut();
        window.location.href = "/login";

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
