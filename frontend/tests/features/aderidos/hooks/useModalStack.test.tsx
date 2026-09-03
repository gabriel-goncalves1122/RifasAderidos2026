import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useModalStack } from "@/features/aderidos/hooks/useModalStack";

describe("Hook: useModalStack", () => {
  it("Deve manter apenas um modal ativo por vez", () => {
    const { result } = renderHook(() => useModalStack());

    act(() => {
      result.current.setModalCheckoutAberto(true);
    });

    expect(result.current.modalCheckoutAberto).toBe(true);

    act(() => {
      result.current.setDrawerNotificacoesAberto(true);
    });

    expect(result.current.modalCheckoutAberto).toBe(false);
    expect(result.current.drawerNotificacoesAberto).toBe(true);
    expect(result.current.current).toBe("notifications");
  });

  it("Deve abrir detalhes com payload e limpar no reset", () => {
    const { result } = renderHook(() => useModalStack());
    const rifa = { numero: "001", status: "pago" };

    act(() => {
      result.current.setRifaParaDetalhes(rifa);
    });

    expect(result.current.current).toBe("details");
    expect(result.current.rifaParaDetalhes).toEqual(rifa);

    act(() => {
      result.current.reset();
    });

    expect(result.current.current).toBeNull();
    expect(result.current.rifaParaDetalhes).toBeNull();
  });
});
