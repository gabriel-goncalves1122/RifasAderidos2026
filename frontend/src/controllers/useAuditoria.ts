import { useState, useCallback } from "react";
import { fetchAPI } from "./api";

export function useAuditoria() {
  const [loading, setLoading] = useState(false);

  const buscarPendentes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAPI("/pendentes");
      return result.bilhetes || [];
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const avaliarComprovante = async (
    numerosRifas: string[],
    decisao: "aprovar" | "rejeitar",
    motivo?: string,
  ) => {
    try {
      await fetchAPI("/avaliar", "POST", { numerosRifas, decisao, motivo });
      return true;
    } catch (error) {
      alert("Falha ao processar a avaliação manual.");
      return false;
    }
  };

  const auditarEmLoteComIA = async () => {
    setLoading(true);
    try {
      return await fetchAPI("/auditar-lote", "POST");
    } finally {
      setLoading(false);
    }
  };

  return { buscarPendentes, avaliarComprovante, auditarEmLoteComIA, loading };
}
