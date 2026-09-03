// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/legacy/hooks/useCompactacao.ts
// ============================================================================
import { useState } from "react";

import { fetchAPI } from "@/shared/services/api";

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
      const blob = await fetchAPI("/admin/compactar", "POST", {
        nomePacote,
        ficheiros: ficheirosRef,
      }, true, "blob") as Blob;

      const downloadUrl = window.URL.createObjectURL(blob);
      const linkOculto = document.createElement("a");
      linkOculto.href = downloadUrl;
      linkOculto.download = `${nomePacote}.zip`;

      document.body.appendChild(linkOculto);
      linkOculto.click();
      document.body.removeChild(linkOculto);
      window.URL.revokeObjectURL(downloadUrl);

      return true;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error("[useCompactacao] Erro:", error);
      }
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
