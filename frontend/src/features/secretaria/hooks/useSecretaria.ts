// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/hooks/useSecretaria.ts
// ============================================================================
import { useCallback, useState } from "react";

import { secretariaService } from "../services/secretariaService";
import {
  AderidoSecretaria,
  FormEditarAderido,
  FormNovoAderido,
} from "../../../shared/types/secretaria";

export function useSecretaria() {
  const [aderidos, setAderidos] = useState<AderidoSecretaria[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarAderidos = useCallback(async () => {
    setLoading(true);

    try {
      const dados = await secretariaService.buscarAderidos();
      setAderidos(dados);

      return dados;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarAderidoIndividual = async (dados: FormNovoAderido) => {
    const resposta = await secretariaService.adicionarAderidoIndividual(dados);

    await carregarAderidos();

    return resposta;
  };

  const atualizarAderidoSecretaria = async (
    id: string,
    dados: FormEditarAderido,
  ) => {
    const resposta = await secretariaService.atualizarAderidoSecretaria(
      id,
      dados,
    );

    await carregarAderidos();

    return resposta;
  };

  return {
    aderidos,
    loading,
    carregarAderidos,
    adicionarAderidoIndividual,
    atualizarAderidoSecretaria,
  };
}
