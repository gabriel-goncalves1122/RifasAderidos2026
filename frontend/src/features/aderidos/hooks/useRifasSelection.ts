import { useCallback, useMemo, useState } from "react";

const VALOR_RIFA = 10;

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

  const valorTotalSelecionado = useMemo(
    () => selecionadas.length * VALOR_RIFA,
    [selecionadas.length],
  );

  return {
    selecionadas,
    possuiSelecao: selecionadas.length > 0,
    valorTotalSelecionado,
    alternarSelecaoRifa,
    limparSelecao,
  };
}
