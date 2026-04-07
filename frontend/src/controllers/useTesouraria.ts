import { useState } from "react";
import { fetchAPI } from "./api";

export function useTesouraria() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarRelatorio = async () => {
    setLoading(true);
    setError(null);
    try {
      return await fetchAPI("/relatorio");
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buscarHistoricoDetalhado = async () => {
    try {
      const result = await fetchAPI("/historico");
      return result.historico || [];
    } catch (error) {
      return [];
    }
  };

  return { buscarRelatorio, buscarHistoricoDetalhado, loading, error };
}
