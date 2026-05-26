import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/shared/config/firebase";

function obterApiBaseUrl() {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL_PROD;
  }

  const hostname = window.location.hostname;
  const hostApi =
    hostname === "localhost" || hostname === "127.0.0.1"
      ? "127.0.0.1"
      : hostname;

  return `http://${hostApi}:5001/rifasaderidos2026/us-central1/api`;
}

const API_BASE_URL = obterApiBaseUrl();

function aguardarUsuarioAutenticado(timeoutMs = 3500): Promise<User | null> {
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve) => {
    let resolvido = false;

    // Evita erro de temporal dead zone caso o callback execute imediatamente.
    let unsubscribe: () => void = () => {};

    const finalizar = (user: User | null) => {
      if (resolvido) return;

      resolvido = true;
      window.clearTimeout(timeout);
      unsubscribe();
      resolve(user);
    };

    const timeout = window.setTimeout(() => {
      finalizar(null);
    }, timeoutMs);

    unsubscribe = onAuthStateChanged(auth, (user) => {
      finalizar(user);
    });
  });
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
      const user = await aguardarUsuarioAutenticado();

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
