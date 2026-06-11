// ============================================================================
// HOOK: useRifasSelection
//
// Gerencia a selecao de rifas para venda no painel do aderido.
// Estado local puro: mantem lista de numeros selecionados,
// calcula valor total e expoe acoes de alternar/limpar.
// ============================================================================
import { useCallback, useMemo, useState } from "react";

import { VALOR_RIFA } from "../utils/constants";

export function useRifasSelection() {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  const alternarSelecaoRifa = useCallback((numero: string, status: string) => {
    if (status !== "disponivel") return;

    setSelecionadas((rifasAtuais) =>
      rifasAtuais.includes(numero)
        ? rifasAtuais.filter((rifa) => rifa !== numero)
        : [...rifasAtuais, numero],
    );
  }, []);

  const limparSelecao = useCallback(() => {
    setSelecionadas([]);
  }, []);

  const possuiSelecao = selecionadas.length > 0;

  const valorTotalSelecionado = useMemo(
    () => selecionadas.length * VALOR_RIFA,
    [selecionadas.length],
  );

  return {
    selecionadas,
    possuiSelecao,
    valorTotalSelecionado,
    alternarSelecaoRifa,
    limparSelecao,
  };
}
