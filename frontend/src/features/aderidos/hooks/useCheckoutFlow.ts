import { useCallback } from "react";

interface UseCheckoutFlowParams {
  fecharCheckout: () => void;
  limparSelecao: () => void;
  invalidarDadosPainel: () => Promise<void>;
}

export function useCheckoutFlow({
  fecharCheckout,
  limparSelecao,
  invalidarDadosPainel,
}: UseCheckoutFlowParams) {
  const finalizarVendaComSucesso = useCallback(async () => {
    fecharCheckout();
    limparSelecao();

    await invalidarDadosPainel();
  }, [fecharCheckout, invalidarDadosPainel, limparSelecao]);

  return {
    finalizarVendaComSucesso,
  };
}
