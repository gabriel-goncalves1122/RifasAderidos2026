import { useState, useCallback } from "react";
import { fetchAPI } from "./api";

export function useAuditoria() {
  const [loading, setLoading] = useState(false);

  const buscarPendentes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAPI("/auditorias/pendentes");
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
      await fetchAPI("/auditorias/avaliar", "POST", {
        numerosRifas,
        decisao,
        motivo,
      });
      return true;
    } catch (error) {
      alert("Falha ao processar a avaliação manual.");
      return false;
    }
  };

  const salvarExtratoCsv = async (extratoCsv: string) => {
    setLoading(true);
    try {
      await fetchAPI("/auditorias/extrato", "POST", { extratoCsv });
      return true;
    } catch (error) {
      alert("Falha ao salvar o extrato no servidor.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const auditarEmLoteComIA = async () => {
    setLoading(true);
    try {
      return await fetchAPI("/auditorias/auditar-lote", "POST");
    } finally {
      setLoading(false);
    }
  };

  return {
    buscarPendentes,
    avaliarComprovante,
    auditarEmLoteComIA,
    salvarExtratoCsv,
    loading,
  };
}
