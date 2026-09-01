import { useCallback } from "react";
import { checkoutStorage } from "../utils/checkoutStorage";

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
    // Limpa toda a persistência do checkout ao finalizar com sucesso.
    checkoutStorage.clear();

    fecharCheckout();
    limparSelecao();

    await invalidarDadosPainel();
  }, [fecharCheckout, invalidarDadosPainel, limparSelecao]);

  return {
    finalizarVendaComSucesso,
  };
}
