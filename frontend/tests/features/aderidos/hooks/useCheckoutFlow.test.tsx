import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCheckoutFlow } from "@/features/aderidos/hooks/useCheckoutFlow";

describe("Hook: useCheckoutFlow", () => {
  it("Deve fechar checkout, limpar seleção e invalidar dados após sucesso", async () => {
    const fecharCheckout = vi.fn();
    const limparSelecao = vi.fn();
    const invalidarDadosPainel = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCheckoutFlow({
        fecharCheckout,
        limparSelecao,
        invalidarDadosPainel,
      }),
    );

    await act(async () => {
      await result.current.finalizarVendaComSucesso();
    });

    expect(fecharCheckout).toHaveBeenCalledTimes(1);
    expect(limparSelecao).toHaveBeenCalledTimes(1);
    expect(invalidarDadosPainel).toHaveBeenCalledTimes(1);
  });
});
