// ============================================================================
// ARQUIVO: frontend/src/controllers/useCompactacao.ts
// ============================================================================
import { useState } from "react";
import { auth } from "../config/firebase";

// Altere este URL quando fizer o deploy para o Render (ex: https://sua-api.onrender.com/api/compactar)
const API_URL = "http://localhost:3001/api/compactar";

export function useCompactacao() {
  const [loadingCompactacao, setLoadingCompactacao] = useState(false);
  const [erroCompactacao, setErroCompactacao] = useState<string | null>(null);

  /**
   * Pede ao Backend para compactar uma lista de ficheiros e inicia o download do ZIP gerado.
   * @param nomePacote O nome que o ficheiro .zip terá quando for descarregado
   * @param ficheirosRef Array com as referências dos ficheiros a incluir
   */
  const solicitarCompactacao = async (
    nomePacote: string,
    ficheirosRef: string[],
  ) => {
    setLoadingCompactacao(true);
    setErroCompactacao(null);

    try {
      // 1. Pega o Token de Segurança do utilizador atual (para o backend saber quem está a pedir)
      const token = await auth.currentUser?.getIdToken();
      if (!token)
        throw new Error("Acesso negado. Precisa estar logado para fazer isto.");

      // 2. Faz o pedido HTTP ao Backend
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // O seu middleware do backend vai validar isto
        },
        body: JSON.stringify({ nomePacote, ficheiros: ficheirosRef }),
      });

      if (!response.ok) {
        // Se o backend devolver um erro (ex: 400 ou 500), tentamos ler a mensagem
        const erroJson = await response.json().catch(() => ({}));
        throw new Error(
          erroJson.erro || "Falha ao gerar o arquivo compactado no servidor.",
        );
      }

      // 3. Recebe a resposta como um "Blob" (Ficheiro Binário) em vez de JSON
      const blob = await response.blob();

      // 4. Truque do Navegador: Cria um link temporário na memória para forçar o Download
      const downloadUrl = window.URL.createObjectURL(blob);
      const linkOculto = document.createElement("a");
      linkOculto.href = downloadUrl;
      linkOculto.download = `${nomePacote}.zip`; // Força o nome do ficheiro

      // Simula o clique no link e depois limpa a memória
      document.body.appendChild(linkOculto);
      linkOculto.click();
      document.body.removeChild(linkOculto);
      window.URL.revokeObjectURL(downloadUrl);

      return true; // Sucesso!
    } catch (error: any) {
      console.error("[useCompactacao] Erro:", error);
      setErroCompactacao(
        error.message || "Erro desconhecido ao comunicar com o servidor.",
      );
      return false;
    } finally {
      setLoadingCompactacao(false);
    }
  };

  return { solicitarCompactacao, loadingCompactacao, erroCompactacao };
}
